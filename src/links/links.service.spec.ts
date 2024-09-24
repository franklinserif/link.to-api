import { Test, TestingModule } from '@nestjs/testing';
import { LinksService } from './links.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Link } from './entities/link.entity';
import { VisitsService } from '@visits/visits.service';
import { PassportModule } from '@nestjs/passport';

describe('LinksService', () => {
  let service: LinksService;

  beforeEach(async () => {
    const mockLinkRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const mockVisitsService = {
      create: jest.fn(), // Simula los métodos que utilices del VisitsService
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        LinksService,
        {
          provide: getRepositoryToken(Link),
          useValue: mockLinkRepository,
        },
        {
          provide: VisitsService,
          useValue: mockVisitsService,
        },
      ],
    }).compile();

    service = module.get<LinksService>(LinksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
