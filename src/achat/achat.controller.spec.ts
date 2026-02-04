import { Test, TestingModule } from '@nestjs/testing';
import { AchatController } from './achat.controller';

describe('AchatController', () => {
  let controller: AchatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AchatController],
    }).compile();

    controller = module.get<AchatController>(AchatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
