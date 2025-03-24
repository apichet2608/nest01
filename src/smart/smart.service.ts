import { Injectable } from '@nestjs/common';
import { SmartQueryService } from './services/number_page/smart-query.service';
import { ApiResponse } from '../common/interfaces/api-response.interface';

@Injectable()
export class SmartService {
  constructor(private readonly queryService: SmartQueryService) {}

  findAll(): Promise<ApiResponse<any[]>> {
    return this.queryService.findAll();
  }

  findOne(id: number): ApiResponse<string> {
    return this.queryService.findOne(id);
  }

  findmoreparams(id: number, name: string): ApiResponse<string> {
    return this.queryService.findmoreparams(id, name);
  }
}
