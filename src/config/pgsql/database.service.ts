import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as pg from 'pg';
import { DatabaseType, databaseConfigs, createPool } from './pgsql.config';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private pools: Record<DatabaseType, pg.Pool> = {} as Record<DatabaseType, pg.Pool>;

  constructor() {
    // สร้าง pool สำหรับทุกฐานข้อมูลที่กำหนดใน config
    Object.entries(databaseConfigs).forEach(([name, config]) => {
      this.pools[name as DatabaseType] = createPool(config);
    });
  }

  onModuleInit() {
    // เพิ่ม error handler สำหรับแต่ละ pool
    Object.entries(this.pools).forEach(([name, pool]) => {
      pool.on('error', err => {
        this.logger.error(`Unexpected error on idle client in ${name} pool`, err);
      });
    });

    this.logger.log('Database service initialized');
  }

  onModuleDestroy() {
    // ปิด pool ทั้งหมดเมื่อแอปปิด
    return Promise.all(
      Object.entries(this.pools).map(async ([name, pool]) => {
        this.logger.log(`Closing ${name} database pool`);
        return pool.end();
      }),
    );
  }

  async query(dbType: DatabaseType, query: string, params: any[] = []) {
    let client;
    try {
      client = await this.pools[dbType].connect();
      const result = await client.query(query, params);
      return result;
    } catch (error) {
      this.logger.error(`Error executing query on ${dbType} database:`, error);
      throw error;
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  async transaction(dbType: DatabaseType, queryObjects: { text: string; params?: any[] }[]) {
    let client;
    try {
      client = await this.pools[dbType].connect();
      await client.query('BEGIN');

      for (const queryObject of queryObjects) {
        await client.query(queryObject.text, queryObject.params || []);
      }

      await client.query('COMMIT');
      return true;
    } catch (error) {
      this.logger.error(`Error executing transaction on ${dbType} database:`, error);
      if (client) {
        await client.query('ROLLBACK').catch(rollbackError => {
          this.logger.error('Error during rollback:', rollbackError);
        });
      }
      throw error;
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  // เช็คการเชื่อมต่อฐานข้อมูล
  async checkConnection(dbType: DatabaseType): Promise<boolean> {
    try {
      const client = await this.pools[dbType].connect();
      client.release();
      return true;
    } catch (error) {
      this.logger.error(`Database ${dbType} connection check failed:`, error);
      return false;
    }
  }

  // พยายามเชื่อมต่อใหม่ถ้าจำเป็น
  async reconnect(dbType: DatabaseType): Promise<boolean> {
    try {
      // ปิด pool เดิม
      await this.pools[dbType].end();

      // สร้าง pool ใหม่จาก config
      this.pools[dbType] = createPool(databaseConfigs[dbType]);

      // เพิ่ม error handler
      this.pools[dbType].on('error', err => {
        this.logger.error(`Unexpected error on idle client in ${dbType} pool`, err);
      });

      // ทดสอบการเชื่อมต่อ
      return this.checkConnection(dbType);
    } catch (error) {
      this.logger.error(`Failed to reconnect to ${dbType} database:`, error);
      return false;
    }
  }

  // เพิ่มเมธอดสำหรับดึงรายชื่อฐานข้อมูลที่มีอยู่
  getDatabaseTypes(): DatabaseType[] {
    return Object.keys(this.pools) as DatabaseType[];
  }
}
