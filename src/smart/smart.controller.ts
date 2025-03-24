import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { SmartService } from './smart.service';
import { Response } from 'express';
import { ApiResponse } from '../common/interfaces/api-response.interface';

@Controller('smart')
export class SmartController {
  constructor(private readonly smartService: SmartService) {}

  @Get()
  async findAll(@Res() res: Response) {
    const response = await this.smartService.findAll();

    if (response.status === 'ERROR') {
      return res.status(HttpStatus.OK).json(response);
    } else if (response.status === 'Catch' || response.error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
    }

    return res.status(HttpStatus.OK).json(response);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.smartService.findOne(+id);
  }

  @Get(':id/:name')
  findmoreparams(@Param('id') id: string, @Param('name') name: string) {
    return this.smartService.findmoreparams(+id, name);
  }
}
