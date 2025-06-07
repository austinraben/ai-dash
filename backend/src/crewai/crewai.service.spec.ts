import { Test, TestingModule } from '@nestjs/testing';
import { CrewaiService } from './crewai.service';

describe('CrewaiService', () => {
  let service: CrewaiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrewaiService],
    }).compile();

    service = module.get<CrewaiService>(CrewaiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
