import { PartialType } from '@nestjs/mapped-types';
import { CreateSmartDto } from './create-smart.dto';

export class UpdateSmartDto extends PartialType(CreateSmartDto) {}
