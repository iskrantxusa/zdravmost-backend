import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { dataSourceOptions } from './config/database.config';

// Загружаем переменные окружения
config();

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
