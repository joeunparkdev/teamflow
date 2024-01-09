import { Test, TestingModule } from '@nestjs/testing';
import { BoardUserService } from './board-user.service';

describe('BoardUserService', () => {
  let service: BoardUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoardUserService],
    }).compile();

    service = module.get<BoardUserService>(BoardUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
