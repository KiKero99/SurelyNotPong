import { Test, TestingModule } from '@nestjs/testing';
import { MatchFactoryService } from './match-factory.service';

describe('MatchFactoryService', () => {
  let service: MatchFactoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchFactoryService],
    }).compile();

    service = module.get<MatchFactoryService>(MatchFactoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
