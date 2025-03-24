import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../config/pgsql/database.service';
import { ApiResponse } from '../../../common/interfaces/api-response.interface';
import * as dayjs from 'dayjs';
import { DatabaseType } from '../../../config/pgsql/pgsql.config';

@Injectable()
export class SmartQueryService {
  constructor(private databaseService: DatabaseService) {}

  async findAll(): Promise<ApiResponse<any[]>> {
    try {
      // สามารถเปลี่ยนประเภทฐานข้อมูลได้ง่ายๆ
      const dbType: DatabaseType = 'pgsql_10_17_166_144_iot';
      const result = await this.databaseService.query(
        dbType,
        `
                select
	id,
	username,
	"password",
	email,
	code
from
	public.crud_table
                `,
      );
      if (result.rows.length > 0) {
        return {
          status: 'OK',
          data: result.rows,
          message: 'Records retrieved successfully',
          timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        };
      } else {
        return {
          status: 'ERROR',
          data: result.rows,
          message: 'Records not retrieved',
          timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        };
      }
    } catch (error) {
      console.error('Error executing query:', error);

      let errorMessage = 'Failed to retrieve records';

      if (error.code === 'ECONNREFUSED') {
        errorMessage =
          'Database connection refused. Please check if the database server is running and the connection details are correct.';
      } else if (error.code === 'ETIMEDOUT') {
        errorMessage =
          'Database connection timed out. Please check your network connection and database server status.';
      } else if (error.code === '42P01') {
        errorMessage = 'Relation does not exist. Please check your table name and schema.';
      } else if (error.code === '28P01') {
        errorMessage = 'Authentication failed. Please check your database credentials.';
      }

      return {
        status: 'ERROR',
        error: {
          code: error.code || 'UNKNOWN',
          message: errorMessage,
          details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        },
        message: error.toString(),
        timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      };
    }
  }

  // New method for direct insert
  async insertCrudData(userData: {
    username: string;
    password: string;
    email: string;
    code: string;
  }): Promise<ApiResponse<any>> {
    try {
      const dbType: DatabaseType = 'pgsql_10_17_166_144_iot';
      const { username, password, email, code } = userData;

      const result = await this.databaseService.query(
        dbType,
        `
                INSERT INTO public.crud_table
                (username, "password", email, code)
                VALUES
                ($1, $2, $3, $4)
                RETURNING id, username, email, code
                `,
        [username, password, email, code],
      );

      return {
        status: 'OK',
        data: result.rows[0],
        message: 'Record inserted successfully',
        timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      };
    } catch (error) {
      console.error('Error executing insert query:', error);

      let errorMessage = 'Failed to insert record';

      if (error.code === '23505') {
        errorMessage = 'Duplicate key violation. Record with this key already exists.';
      } else if (error.code === '23502') {
        errorMessage = 'Not null violation. Please provide values for all required fields.';
      } else if (error.code === '22001') {
        errorMessage = 'Value too long for column. Please check your input data.';
      }

      return {
        status: 'ERROR',
        error: {
          code: error.code || 'UNKNOWN',
          message: errorMessage,
          details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        },
        message: error.toString(),
        timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      };
    }
  }
}
