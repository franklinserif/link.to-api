import { Test, TestingModule } from '@nestjs/testing';
import { LinksController } from '@links/links.controller';
import { LinksService } from '@links/links.service';
import { VisitsService } from '@visits/visits.service';
import { PassportModule } from '@nestjs/passport';
import { VisitorInformation } from '@shared/interfaces/visitor';
import { LINKS } from '@shared/constants/testVariables';
import { Response } from 'express';
import { User } from '@users/entities/user.entity';
import { CreateLinkDto, UpdateLinkDto } from './dto';

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

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    redirect: jest.fn(),
  } as unknown as Response;

  const mockCreateLink = {
    ...LINKS[0],
    id: 'd2e8b232-a6e3-435f-ae53-64f294c6a41f',
    urlOriginal: 'https://wikipedia.com',
    shortURL: '2x315',
    updatedAt: new Date(),
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [LinksController],
      providers: [
        LinksService,
        {
          provide: LinksService,
          useValue: {
            findAll: jest.fn(() => LINKS),
            findOriginalUrl: jest.fn(
              (id: string, visitor: VisitorInformation) =>
                LINKS.find((link) => link.id === id),
            ),
            create: jest.fn(
              (criteria: { createLinkDto: CreateLinkDto; user: User }) => ({
                ...mockCreateLink,
              }),
            ),
            update: jest.fn((id: string, updateLinkDto: UpdateLinkDto) => ({
              ...mockCreateLink,
              urlOriginal: updateLinkDto.urlOriginal,
            })),
            remove: jest.fn((id: string) => ({ id })),
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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of links', async () => {
    const links = await controller.findAll({} as User);
    expect(links).toEqual(LINKS);
  });
  /* 
  it('should return a redirect to the original URL if the link exists and is active', async () => {
    const id = LINKS[1].id;

    await controller.findOne(id, visitor, mockResponse);

    expect(mockResponse.redirect).toHaveBeenCalledWith(LINKS[1].urlOriginal);
  });

  it('should return a 404 redirect if the link is inactive', async () => {
    const id = LINKS[0].id;

    await controller.findOne(id, visitor, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.redirect).toHaveBeenCalledWith('/');
  }); */

  it('should create a link', async () => {
    const link = await controller.create(mockCreateLink);

    expect(link).toEqual(mockCreateLink);
  });

  it('should update a link', async () => {
    const updateLinkDto: UpdateLinkDto = {
      urlOriginal: 'https://chatgpt.com',
    };
    const updateLink = await controller.update(
      mockCreateLink.id,
      updateLinkDto,
    );

    expect(updateLink).toEqual({
      ...updateLink,
      urlOriginal: 'https://chatgpt.com',
    });
  });

  it('should remove a link', async () => {
    const id = '1';
    const result = await controller.remove(id);
    expect(result).toEqual({ id });
    expect(service.remove).toHaveBeenCalledWith(id);
  });
});
