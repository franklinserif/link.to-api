import { Test, TestingModule } from '@nestjs/testing';
import { LinksController } from '@links/links.controller';
import { LinksService } from '@links/links.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Link } from '@links/entities/link.entity';
import { VisitsService } from '@visits/visits.service'; // Asegúrate de importar el servicio adecuado
import { PassportModule } from '@nestjs/passport';

describe('LinksController', () => {
  let controller: LinksController;
  //let service: LinksService;

  beforeEach(async () => {
    const mockLinkRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    const mockVisitsService = {
      trackVisit: jest.fn(), // Simula cualquier método que utilices del VisitsService
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [LinksController],
      providers: [
        LinksService,
        {
          provide: getRepositoryToken(Link),
          useValue: mockLinkRepository,
        },
        {
          provide: VisitsService, // Proporciona el mock del VisitsService
          useValue: mockVisitsService,
        },
      ],
    }).compile();

    controller = module.get<LinksController>(LinksController);
    // service = module.get<LinksService>(LinksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
