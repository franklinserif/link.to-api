import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { VisitsService } from '@visits/visits.service';
import { LinksService } from '@links/links.service';
import { LinksController } from '@links/links.controller';
import { LINKS } from '@shared/constants/testVariables';
import { User } from '@users/entities/user.entity';
import { CreateLinkDto, UpdateLinkDto } from '@links/dto';

describe('LinksController', () => {
  let controller: LinksController;
  let service: LinksService;

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
            create: jest.fn(
              (criteria: { createLinkDto: CreateLinkDto; user: User }) => ({
                ...criteria,
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
