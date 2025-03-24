import * as pg from 'pg';

export type DatabaseType = 'primary' | 'secondary' | 'reporting' | 'analytics'; // เพิ่มประเภทได้ตามต้องการ

export interface DatabaseConfig {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
  ssl?: any;
  // เพิ่มตัวเลือกอื่นๆ ของ pg.PoolConfig ตามต้องการ
}

// กำหนดค่า config สำหรับแต่ละฐานข้อมูล
export const databaseConfigs: Record<DatabaseType, DatabaseConfig> = {
  primary: {
    user: process.env.PRIMARY_DB_USER || 'postgres',
    host: process.env.PRIMARY_DB_HOST || '10.17.166.144',
    database: process.env.PRIMARY_DB_NAME || 'iot',
    password: process.env.PRIMARY_DB_PASSWORD || 'postgres',
    port: parseInt(process.env.PRIMARY_DB_PORT || '5432'),
  },
  secondary: {
    user: process.env.SECONDARY_DB_USER || 'postgres',
    host: process.env.SECONDARY_DB_HOST || 'localhost',
    database: process.env.SECONDARY_DB_NAME || 'postgres',
    password: process.env.SECONDARY_DB_PASSWORD || 'postgres',
    port: parseInt(process.env.SECONDARY_DB_PORT || '5432'),
  },
  // สามารถเพิ่มฐานข้อมูลอื่นๆ ได้ง่ายๆ ตรงนี้
  reporting: {
    user: process.env.REPORTING_DB_USER || 'postgres',
    host: process.env.REPORTING_DB_HOST || 'localhost',
    database: process.env.REPORTING_DB_NAME || 'reporting',
    password: process.env.REPORTING_DB_PASSWORD || 'postgres',
    port: parseInt(process.env.REPORTING_DB_PORT || '5432'),
  },
  analytics: {
    user: process.env.ANALYTICS_DB_USER || 'postgres',
    host: process.env.ANALYTICS_DB_HOST || 'localhost',
    database: process.env.ANALYTICS_DB_NAME || 'analytics',
    password: process.env.ANALYTICS_DB_PASSWORD || 'postgres',
    port: parseInt(process.env.ANALYTICS_DB_PORT || '5432'),
  },
};

// ฟังก์ชันสำหรับสร้าง pool จาก config
export function createPool(config: DatabaseConfig): pg.Pool {
  return new pg.Pool(config);
}
