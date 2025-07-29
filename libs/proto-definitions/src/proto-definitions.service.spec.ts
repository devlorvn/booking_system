import { Test, TestingModule } from '@nestjs/testing';
import { ProtoDefinitionsService } from './proto-definitions.service';

describe('ProtoDefinitionsService', () => {
  let service: ProtoDefinitionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProtoDefinitionsService],
    }).compile();

    service = module.get<ProtoDefinitionsService>(ProtoDefinitionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
