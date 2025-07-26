# База данных - Zdravmost Backend

## Обзор архитектуры БД

Система использует PostgreSQL с TypeORM для управления схемой базы данных. Схема разработана для телемедицинской платформы и включает:

### Основные сущности

1. **users** - Базовая таблица пользователей
2. **doctor_profile** - Профили врачей (связь 1-1 с users)
3. **patient_profile** - Профили пациентов (связь 1-1 с users)
4. **appointment** - Записи на прием (связывает врачей и пациентов)
5. **consultation** - Консультации (видеозвонки, связанные с записями)
6. **emr_record** - Электронная медицинская карта (JSONB данные)
7. **payment** - Платежи за консультации

### Схема связей

```
users
├── doctor_profile (1:1)
│   └── appointments (1:N) as doctor
└── patient_profile (1:1)
    └── appointments (1:N) as patient

appointment
└── consultation (1:1)
    ├── emr_records (1:N)
    └── payments (1:N)
```

## Конфигурация

Настройки базы данных находятся в `.env` файле:

```env
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=zdrav
DB_PASSWORD=zdrav
DB_NAME=zdrav
DB_SYNCHRONIZE=true  # ТОЛЬКО для разработки!
DB_LOGGING=true
```

**⚠️ Важно:** В продакшене всегда устанавливайте `DB_SYNCHRONIZE=false` и используйте миграции!

## Работа с миграциями

### Доступные команды

```bash
# Создать пустую миграцию
npm run migration:create src/migrations/MigrationName

# Сгенерировать миграцию на основе изменений в сущностях
npm run migration:generate src/migrations/MigrationName

# Выполнить все новые миграции
npm run migration:run

# Откатить последнюю миграцию
npm run migration:revert

# Синхронизировать схему (ТОЛЬКО для разработки!)
npm run schema:sync

# Удалить всю схему (ОСТОРОЖНО!)
npm run schema:drop
```

### Рабочий процесс с миграциями

1. **Создание новой миграции:**
   ```bash
   npm run migration:create src/migrations/AddIndexesToAppointments
   ```

2. **Автогенерация после изменений сущностей:**
   ```bash
   npm run migration:generate src/migrations/UpdateUserEntity
   ```

3. **Выполнение миграций:**
   ```bash
   npm run migration:run
   ```

4. **Откат при ошибке:**
   ```bash
   npm run migration:revert
   ```

## Структура JSONB полей

### doctor_profile.education
```json
[
  {
    "institution": "Московский медицинский университет",
    "degree": "Врач",
    "year": 2015,
    "specialty": "Терапия"
  }
]
```

### doctor_profile.working_hours
```json
{
  "monday": { "start": "09:00", "end": "18:00" },
  "tuesday": { "start": "09:00", "end": "18:00" },
  "wednesday": { "start": "09:00", "end": "18:00" },
  "thursday": { "start": "09:00", "end": "18:00" },
  "friday": { "start": "09:00", "end": "17:00" },
  "saturday": null,
  "sunday": null
}
```

### emr_record.data (примеры)

**Диагноз:**
```json
{
  "icd10Code": "K29.7",
  "description": "Гастрит неуточненный",
  "severity": "mild",
  "status": "confirmed"
}
```

**Рецепт:**
```json
{
  "medications": [
    {
      "name": "Омепразол",
      "dosage": "20мг",
      "frequency": "1 раз в день",
      "duration": "14 дней",
      "instructions": "Принимать утром натощак"
    }
  ]
}
```

**Жизненные показатели:**
```json
{
  "bloodPressure": { "systolic": 120, "diastolic": 80 },
  "heartRate": 72,
  "temperature": 36.6,
  "weight": 70,
  "height": 175
}
```

## Индексы и производительность

### Рекомендуемые индексы

1. **appointments:**
   - `(doctor_id, scheduled_at)` - для поиска записей врача
   - `(patient_id, status)` - для поиска записей пациента
   - `(scheduled_at, status)` - для календарных запросов

2. **emr_records:**
   - `(consultation_id, type)` - для группировки по типу записи
   - `(created_by, created_at)` - для истории врача

3. **payments:**
   - `(consultation_id, status)` - для отчетов по платежам
   - `(provider_transaction_id)` - для поиска по внешнему ID

### Создание индексов

```sql
-- Индексы для appointments
CREATE INDEX idx_appointments_doctor_schedule 
ON appointments(doctor_id, scheduled_at);

-- Индексы для emr_records  
CREATE INDEX idx_emr_consultation_type 
ON emr_records(consultation_id, type);

-- JSONB индексы
CREATE INDEX idx_emr_records_data_gin 
ON emr_records USING GIN (data);
```

## Безопасность данных

### Шифрование чувствительных данных

1. **emr_record.is_encrypted** - флаг для шифрования
2. **emr_record.is_sensitive** - пометка чувствительных данных
3. Используйте `MEDICAL_DATA_ENCRYPTION_KEY` из `.env`

### Аудит и логирование

- Все изменения автоматически отслеживаются через `created_at`/`updated_at`
- Для критичных операций ведите отдельный аудит-лог

## Бэкапы

### Ежедневный бэкап
```bash
pg_dump -h $DB_HOST -U $DB_USERNAME -d $DB_NAME > backup_$(date +%Y%m%d).sql
```

### Восстановление
```bash
psql -h $DB_HOST -U $DB_USERNAME -d $DB_NAME < backup_20240126.sql
```

## Мониторинг

### Полезные запросы для мониторинга

```sql
-- Активные подключения
SELECT count(*) FROM pg_stat_activity WHERE state = 'active';

-- Медленные запросы
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC LIMIT 10;

-- Размер таблиц
SELECT schemaname, tablename, 
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```
