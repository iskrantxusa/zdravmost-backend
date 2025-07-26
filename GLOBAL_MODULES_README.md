# Глобальные модули: Config, Logger, Validation

## Обзор

Настроены все глобальные модули согласно требованиям:

1. ✅ **@nestjs/config** + схемы через **@hapi/joi**
2. ✅ **Кастомный LoggerService** на основе **winston**
3. ✅ **ValidationPipe** с настройками `{ whitelist: true, forbidNonWhitelisted: true }`
4. ✅ **Глобальные фильтры ошибок** (`AllExceptionsFilter`) и **интерсептор** `ResponseTransform`

## Структура файлов

```
apps/api/src/
├── config/
│   └── config.schema.ts          # Joi схема валидации конфигурации
├── common/
│   ├── logger/
│   │   ├── logger.service.ts     # Кастомный LoggerService на Winston
│   │   └── logger.module.ts      # Модуль логирования
│   ├── filters/
│   │   └── all-exceptions.filter.ts    # Глобальный фильтр исключений
│   └── interceptors/
│       └── response-transform.interceptor.ts # Интерсептор трансформации ответов
├── app.module.ts                 # Главный модуль приложения
└── main.ts                       # Точка входа с глобальными настройками
```

## 1. Конфигурация (@nestjs/config + @hapi/joi)

### config.schema.ts
- Валидация всех переменных окружения через Joi
- Проверка обязательных полей (JWT_SECRET, DB_*, etc.)
- Значения по умолчанию для необязательных полей
- Строгая типизация для PORT, LOG_LEVEL и других

### app.module.ts
```typescript
ConfigModule.forRoot({
  isGlobal: true,
  validationSchema: configValidationSchema,
  validationOptions: {
    allowUnknown: true,
    abortEarly: false,
  },
})
```

## 2. Кастомный Logger на Winston

### CustomLoggerService
- Полная совместимость с интерфейсом `LoggerService` из NestJS
- Поддержка файлового и консольного логирования
- Настраиваемые уровни логирования через переменные окружения
- JSON формат для логов в файлах
- Красивый вывод в консоль для разработки
- Автоматическое создание логов `error.log` и `combined.log`

### Возможности:
- `LOG_LEVEL` - уровень логирования (error, warn, info, debug, etc.)
- `LOG_FILE_ENABLED` - включение/отключение файлового логирования
- `LOG_CONSOLE_ENABLED` - включение/отключение консольного логирования

## 3. Validation Pipeline

### main.ts
```typescript
app.useGlobalPipes(new ValidationPipe({ 
  whitelist: true, 
  forbidNonWhitelisted: true 
}));
```

### Настройки:
- `whitelist: true` - удаляет свойства, не имеющие декораторов
- `forbidNonWhitelisted: true` - возвращает ошибку при наличии неразрешенных свойств

## 4. Глобальные фильтры и интерсепторы

### AllExceptionsFilter
- Перехватывает все исключения в приложении
- Логирует ошибки с контекстом (URL, метод, IP, User-Agent)
- Унифицированный формат ответов об ошибках
- Различает клиентские (4xx) и серверные (5xx) ошибки

### ResponseTransformInterceptor
- Унифицирует формат всех успешных ответов API
- Добавляет метаданные (timestamp, path, method, success)
- Стандартизирует структуру JSON ответов

### Формат ответов:

**Успешный ответ:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request successful",
  "data": { ... },
  "timestamp": "2024-01-01T12:00:00.000Z",
  "path": "/api/endpoint",
  "method": "GET"
}
```

**Ошибка:**
```json
{
  "success": false,
  "statusCode": 400,
  "error": "BadRequestException",
  "message": "Validation failed",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "path": "/api/endpoint",
  "method": "POST"
}
```

## Тестовые эндпоинты

Для демонстрации работы добавлены эндпоинты:

1. `GET /` - обычный эндпоинт с логированием
2. `GET /health` - проверка состояния сервиса
3. `POST /test-validation` - демонстрация валидации (требует `name` и `email`)
4. `GET /test-error` - демонстрация обработки ошибок

## Переменные окружения

Все необходимые переменные окружения настроены в `.env` файле:

```env
# Основные настройки
NODE_ENV=development
PORT=3000

# База данных
DB_HOST=postgres
DB_USERNAME=zdrav
DB_PASSWORD=zdrav
DB_NAME=zdrav

# JWT
JWT_SECRET=dev-super-secret-jwt-key-for-development-only
JWT_EXPIRES_IN=24h

# Логирование
LOG_LEVEL=debug
LOG_FILE_ENABLED=true
LOG_CONSOLE_ENABLED=true
```

## Запуск и тестирование

```bash
# Сборка
npm run build

# Запуск
npm run start:dev

# Тесты API
curl http://localhost:3000/health
curl -X POST http://localhost:3000/test-validation \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com"}'
```

Все модули настроены и готовы к использованию в телемедицинском сервисе ZdravMost.
