import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindOperator, Repository } from 'typeorm';
import { LinksService } from '@links/links.service';
import { Link } from '@links/entities/link.entity';
import { VisitsService } from '@visits/visits.service';
import { LINKS } from '@shared/constants/testVariables';
import { VisitorInformation } from '@shared/interfaces/visitor';

describe('LinksService', () => {
  let service: LinksService;
  let linkRepository: Repository<Link>;
  let LINK_REPOSITORY_TOKEN = getRepositoryToken(Link);
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
      providers: [
        LinksService,
        {
          provide: LINK_REPOSITORY_TOKEN,
          useValue: {
            find: jest.fn(() => LINKS),
            findOneBy: jest.fn((criteria: { id: string }) => {
              return LINKS.find((link) => link.id === criteria.id);
            }),
            findOne: jest.fn((criteria: { where: { shortURL: string } }) => {
              return LINKS.find(
                (link) => link.shortURL === criteria.where.shortURL,
              );
            }),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: VisitsService,
          useValue: { create: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<LinksService>(LinksService);
    linkRepository = module.get<Repository<Link>>(LINK_REPOSITORY_TOKEN);
  });

  describe('linkRepository defined', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('linkRepository should be defined', () => {
      expect(linkRepository).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should be call findAll', async () => {
      await service.findAll('cf21b916-c710-4c84-8db4-bf9069bd3b4b');
      expect(linkRepository.find).toHaveBeenCalled();
    });

    it('should be call findAll', async () => {
      await service.findAll('cf21b916-c710-4c84-8db4-bf9069bd3b4b');
      expect(linkRepository.find).toHaveReturnedWith(LINKS);
    });
  });

  describe('findOne', () => {
    it('should find a link', async () => {
      await service.findOne('98ead8a7-eea9-4b1a-a285-7021eea5d3c3');
      expect(linkRepository.findOneBy).toHaveReturnedWith(LINKS[0]);
    });

    it('should throw an exeption if the id is not found', async () => {
      await expect(
        service.findOne('98ead8a7-eea9-4b1a-a285-7021eea5d3x3'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw an exeption if id is not valid', async () => {
      await expect(service.findOne('2342342q')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('find', () => {
    it('should find a link', async () => {
      const shortUrl = LINKS[0].shortURL;

      const link = await service.findOriginalUrl(shortUrl, visitor);

      expect(link).toEqual(LINKS[0]);
      expect(linkRepository.findOne).toHaveBeenCalledWith({
        where: { shortURL: shortUrl },
      });
    });

    it('should throw a not found exepction when the url not found', async () => {
      const shortUrl = '2lxwad';

      await expect(service.findOriginalUrl(shortUrl, visitor)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a link', async () => {
      const linkId = LINKS[0].id;
      const updateLinkDto = { urlOriginal: 'https://newurl.com' };

      await service.update(linkId, updateLinkDto);

      expect(linkRepository.findOneBy).toHaveBeenCalledWith({ id: linkId });
    });

    it('should throw a NotFoundException if link does not exist', async () => {
      const linkId = 'non-existing-id';
      const updateLinkDto = { urlOriginal: 'https://newurl.com' };

      jest.spyOn(linkRepository, 'findOneBy').mockResolvedValueOnce(undefined);

      await expect(service.update(linkId, updateLinkDto)).rejects.toThrow(
        NotFoundException,
      );

      expect(linkRepository.findOneBy).toHaveBeenCalledWith({ id: linkId });
    });
  });

  describe('delete', () => {
    it('should delete a link', async () => {
      const linkId = LINKS[0].id;

      jest.spyOn(linkRepository, 'findOne').mockResolvedValueOnce(LINKS[0]);

      await service.remove(linkId);

      expect(linkRepository.findOne).toHaveBeenCalledWith({
        where: { id: linkId },
      });

      expect(linkRepository.delete).toHaveBeenCalledWith(linkId);
    });

    it('should throw a NotFoundException if link does not exist', async () => {
      const linkId = 'non-existing-id';

      jest.spyOn(linkRepository, 'findOne').mockResolvedValueOnce(undefined);

      await expect(service.remove(linkId)).rejects.toThrow(NotFoundException);

      expect(linkRepository.findOne).toHaveBeenCalledWith({
        where: { id: linkId },
      });
    });
  });

  describe('cronjob', () => {
    it('should execute cron job', async () => {
      const now = new Date();

      await service.handleCron();

      expect(linkRepository.update).toHaveBeenCalledWith(
        {
          expirationDate: expect.any(FindOperator),
          status: true,
        },
        { status: false },
      );

      expect(linkRepository.delete).toHaveBeenCalledWith({
        status: false,
        expirationDate: expect.any(FindOperator),
      });
    });
  });
});
