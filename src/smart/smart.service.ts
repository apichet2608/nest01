import { Injectable } from '@nestjs/common';
import { SmartQueryService } from './services/number_page/smart-query.service';
import { ApiResponse } from '../common/interfaces/api-response.interface';

@Injectable()
export class SmartService {
  constructor(private readonly queryService: SmartQueryService) {}

  findAll(): Promise<ApiResponse<any[]>> {
    return this.queryService.findAll();
  }

  insertCrudData(userData: {
    username: string;
    password: string;
    email: string;
    code: string;
  }): Promise<ApiResponse<any>> {
    return this.queryService.insertCrudData(userData);
  }
}
