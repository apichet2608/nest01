import { Test, TestingModule } from '@nestjs/testing';
import { SmartService } from './smart.service';

describe('SmartService', () => {
  let service: SmartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmartService],
    }).compile();

    service = module.get<SmartService>(SmartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
