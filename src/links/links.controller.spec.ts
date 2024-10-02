import { Test, TestingModule } from '@nestjs/testing';
import { LinksController } from '@links/links.controller';
import { LinksService } from '@links/links.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Link } from '@links/entities/link.entity';
import { VisitsService } from '@visits/visits.service'; // Asegúrate de importar el servicio adecuado
import { PassportModule } from '@nestjs/passport';
import { VisitorInformation } from '@shared/interfaces/visitor';
import { LINKS } from '@shared/constants/testVariables';

describe('LinksController', () => {
  let controller: LinksController;
  let service: LinksService;
  const visitor: VisitorInformation = {
    userAgent: {
      browser: 'chrome',
      os: 'Linux' as unknown as UAParser.IOS,
    },
    geo: {
      ip: '192.168.123.132',
      location: 'san francisco',
      country: 'EEUU',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [LinksController],
      providers: [
        LinksService,
        {
          provide: getRepositoryToken(Link),
          useValue: {
            findAll: jest.fn(() => LINKS),
            findOne: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: VisitsService,
          useValue: { trackVisit: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<LinksController>(LinksController);
    service = module.get<LinksService>(LinksService);

    jest
      .spyOn(service as any, 'checkExpireDate')
      .mockImplementation(async (link: Link) => {
        if (link.expirationDate > new Date()) {
          return link;
        } else {
          link.status = false;
          return link;
        }
      });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
