import * as pg from 'pg';

export type DatabaseType = string;

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
  pgsql_10_17_166_144_iot: {
    user: process.env.POSTGRES_USER_NAME_10_17_166_144 || 'postgres',
    host: process.env.POSTGRES_HOST_NAME_10_17_166_144 || '127.0.0.1',
    password: process.env.POSTGRES_PASSWORD_10_17_166_144 || 'postgres',
    port: parseInt(process.env.POSTGRES_PORTS_10_17_166_144 || '5432'),
    database: 'iot',
  },
};

// ฟังก์ชันสำหรับสร้าง pool จาก config
export function createPool(config: DatabaseConfig): pg.Pool {
  return new pg.Pool(config);
}
