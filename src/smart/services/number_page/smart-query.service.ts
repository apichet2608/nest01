import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../config/pgsql/database.service';
import { ApiResponse } from '../../../common/interfaces/api-response.interface';
import * as dayjs from 'dayjs';
import { DatabaseType } from '../../../config/pgsql/pgsql.config';

@Injectable()
export class SmartQueryService {
    constructor(private databaseService: DatabaseService) { }

    async findAll(): Promise<ApiResponse<any[]>> {
        try {
            // สามารถเปลี่ยนประเภทฐานข้อมูลได้ง่ายๆ
            const dbType: DatabaseType = 'primary';
            const result = await this.databaseService.query(
                dbType,
                'SELECT * FROM smart_ewk.smart_ewk_daily_record_jobid_header',
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
                errorMessage =
                    'Relation does not exist. Please check your table name and schema.';
            } else if (error.code === '28P01') {
                errorMessage =
                    'Authentication failed. Please check your database credentials.';
            }

            return {
                status: 'ERROR',
                error: {
                    code: error.code || 'UNKNOWN',
                    message: errorMessage,
                    details:
                        process.env.NODE_ENV === 'development' ? error.message : undefined,
                },
                message: error.toString(),
                timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            };
        }
    }

    findOne(id: number): ApiResponse<string> {
        return {
            status: 'OK',
            data: `This action returns a #${id} smart`,
            timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        };
    }

    findmoreparams(id: number, name: string): ApiResponse<string> {
        return {
            status: 'OK',
            data: `This action returns a #${id} smart with name ${name}`,
            timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        };
    }
}
