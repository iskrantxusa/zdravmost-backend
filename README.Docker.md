# Docker Setup для Zdravmost Backend

## Обзор архитектуры

Docker окружение состоит из следующих сервисов:

- **API** - NestJS приложение (порт 3000)
- **PostgreSQL** - База данных (порт 5432)
- **Redis** - Кэш и сессии (порт 6379)
- **Mailpit** - Локальная SMTP песочница (порты 1025/8025)

## Быстрый старт

### 1. Запуск окружения

```bash
# Запуск всех сервисов в фоновом режиме
docker-compose up -d --build

# Просмотр статуса контейнеров
docker-compose ps
```

### 2. Проверка работы API

```bash
# Проверка главной страницы
curl http://localhost:3000

# Проверка health endpoint
curl http://localhost:3000/health
```

### 3. Просмотр логов

```bash
# Логи всех сервисов
docker-compose logs

# Логи конкретного сервиса
docker-compose logs api
docker-compose logs postgres
docker-compose logs redis
docker-compose logs mailpit
```

## Файлы конфигурации

### Development окружение (docker-compose.yml)

- **Dockerfile.dev** - используется для development
- **docker-compose.yml** - основная конфигурация для разработки
- **.env** - переменные окружения для развертывания

### Production окружение (Dockerfile)

- **Dockerfile** - production build с оптимизацией
- Использует multi-stage build
- Запускается с непривилегированным пользователем
- Включает health check

## Переменные окружения

Все переменные настроены в файле `.env`:

### База данных
```
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=zdrav
DB_PASSWORD=zdrav
DB_NAME=zdrav
```

### Redis
```
REDIS_HOST=redis
REDIS_PORT=6379
```

### Email (Mailpit)
```
SMTP_HOST=mailpit
SMTP_PORT=1025
```

## Доступ к сервисам

| Сервис    | URL                      | Описание                    |
|-----------|-------------------------|-----------------------------|
| API       | http://localhost:3000   | NestJS Backend API          |
| PostgreSQL| localhost:5432          | База данных                 |
| Redis     | localhost:6379          | Кэш и сессии               |
| Mailpit   | http://localhost:8025   | Web интерфейс для почты     |
| SMTP      | localhost:1025          | SMTP сервер для отправки    |

## Команды для работы

### Управление контейнерами

```bash
# Запуск
docker-compose up -d

# Пересборка и запуск
docker-compose up -d --build

# Остановка
docker-compose down

# Остановка с удалением volumes
docker-compose down -v

# Перезапуск конкретного сервиса
docker-compose restart api
```

### Работа с данными

```bash
# Подключение к PostgreSQL
docker-compose exec postgres psql -U zdrav -d zdrav

# Подключение к Redis CLI
docker-compose exec redis redis-cli

# Выполнение команд в API контейнере
docker-compose exec api npm run test
docker-compose exec api npm run lint
```

### Debugging

```bash
# Просмотр логов в реальном времени
docker-compose logs -f api

# Вход в контейнер API
docker-compose exec api sh

# Проверка сетевых соединений
docker-compose exec api ping postgres
docker-compose exec api ping redis
```

## Volumes

- **postgres_data** - данные PostgreSQL (персистентные)
- **redis_data** - данные Redis (персистентные)
- **node_modules** - зависимости Node.js (для development)
- **Source code mount** - код приложения примонтирован для hot reload

## Production Deployment

Для production используйте основной `Dockerfile`:

```bash
# Сборка production образа
docker build -t zdravmost-backend:latest .

# Запуск production контейнера
docker run -d \
  --name zdravmost-api \
  -p 3000:3000 \
  --env-file .env.production \
  zdravmost-backend:latest
```

## Troubleshooting

### Проблемы с портами
```bash
# Проверка занятых портов
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :5432
```

### Проблемы с зависимостями
```bash
# Пересборка без кэша
docker-compose build --no-cache api
```

### Очистка системы
```bash
# Удаление неиспользуемых образов
docker system prune

# Полная очистка Docker
docker system prune -a --volumes
```

## Мониторинг

### Health Checks

API контейнер включает health check:
```bash
# Проверка статуса health check
docker inspect zdravmost-backend_api_1 | grep -A 10 Health
```

### Ресурсы
```bash
# Мониторинг ресурсов
docker-compose top
docker stats
```
