import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { SmartService } from './smart.service';
import { Response } from 'express';

@Controller('smart')
export class SmartController {
  constructor(private readonly smartService: SmartService) {}

  @Get(`/findAll`)
  async findAll(@Res() res: Response) {
    const response = await this.smartService.findAll();

    if (response.status === 'ERROR') {
      return res.status(HttpStatus.OK).json(response);
    } else if (response.status === 'Catch' || response.error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
    }

    return res.status(HttpStatus.OK).json(response);
  }

  @Post('insert-crud')
  async insertCrudData(@Body() userData: any, @Res() res: Response) {
    // Validate required fields
    const { username, password, email, code } = userData;
    const validationErrors: string[] = [];

    if (!username) {
      validationErrors.push('Username is required');
    } else if (typeof username !== 'string') {
      validationErrors.push('Username must be a string');
    } else if (username.length > 50) {
      // Assuming max length is 50
      validationErrors.push('Username must be less than 50 characters');
    }

    if (!password) {
      validationErrors.push('Password is required');
    } else if (typeof password !== 'string') {
      validationErrors.push('Password must be a string');
    }

    if (!email) {
      validationErrors.push('Email is required');
    } else if (typeof email !== 'string') {
      validationErrors.push('Email must be a string');
    } else {
      // Basic email validation using regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        validationErrors.push('Invalid email format');
      }
    }

    if (!code) {
      validationErrors.push('Code is required');
    } else if (typeof code !== 'string') {
      validationErrors.push('Code must be a string');
    }

    // If validation errors exist, return bad request
    if (validationErrors.length > 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: 'ERROR',
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: validationErrors,
        },
        message: 'Invalid input data',
        timestamp: new Date().toISOString(),
      });
    }

    // If validation passes, proceed with the insert
    const response = await this.smartService.insertCrudData({
      username,
      password,
      email,
      code,
    });

    if (response.status === 'ERROR') {
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    } else if (response.error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
    }

    return res.status(HttpStatus.CREATED).json(response);
  }
}
