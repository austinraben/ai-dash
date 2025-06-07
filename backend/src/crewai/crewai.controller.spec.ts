import { Test, TestingModule } from '@nestjs/testing';
import { CrewaiController } from './crewai.controller';

describe('CrewaiController', () => {
  let controller: CrewaiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrewaiController],
    }).compile();

    controller = module.get<CrewaiController>(CrewaiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
