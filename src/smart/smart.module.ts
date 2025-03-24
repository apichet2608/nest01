import { Module } from '@nestjs/common';
import { SmartService } from './smart.service';
import { SmartController } from './smart.controller';
import { SmartQueryService } from './services/number_page/smart-query.service';

@Module({
  controllers: [SmartController],
  providers: [SmartService, SmartQueryService],
})
export class SmartModule {}
