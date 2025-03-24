import { Test, TestingModule } from '@nestjs/testing';
import { SmartController } from './smart.controller';
import { SmartService } from './smart.service';

describe('SmartController', () => {
  let controller: SmartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SmartController],
      providers: [SmartService],
    }).compile();

    controller = module.get<SmartController>(SmartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
