import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { VisitsService } from '@visits/visits.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Visit } from '@visits/entities/visit.entity';
import { CreateVisitDto } from '@visits/dto';

describe('VisitsService', () => {
  let service: VisitsService;
  let visitsRepository: Repository<Visit>;

  const mockVisitRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VisitsService,
        {
          provide: getRepositoryToken(Visit),
          useValue: mockVisitRepository,
        },
      ],
    }).compile();

    service = module.get<VisitsService>(VisitsService);
    visitsRepository = module.get<Repository<Visit>>(getRepositoryToken(Visit));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a visit', async () => {
    const createVisitDto: CreateVisitDto = {
      browser: 'chrome',
      os: 'Mac Os',
      location: 'California',
      country: 'EEUU',
      ip: '144.123.12',
      link: null,
    };

    const mockVisit = {
      id: 'visit-id',
      ...createVisitDto,
    };

    mockVisitRepository.create.mockReturnValue(mockVisit);
    mockVisitRepository.save.mockResolvedValue(mockVisit);

    const result = await service.create(createVisitDto);

    expect(visitsRepository.create).toHaveBeenCalledWith(createVisitDto);
    expect(visitsRepository.save).toHaveBeenCalledWith(mockVisit);
    expect(result).toEqual(mockVisit);
  });

  it('should throw BadRequestException on error', async () => {
    const createVisitDto: CreateVisitDto = {
      browser: 'chrome',
      os: 'Mac Os',
      location: 'California',
      country: 'EEUU',
      ip: '144.123.12',
      link: null,
    };

    mockVisitRepository.create.mockReturnValue(createVisitDto);
    mockVisitRepository.save.mockRejectedValue(new Error('Database error'));

    await expect(service.create(createVisitDto)).rejects.toThrow(
      InternalServerErrorException,
    );
    expect(visitsRepository.create).toHaveBeenCalledWith(createVisitDto);
    expect(visitsRepository.save).toHaveBeenCalledWith(createVisitDto);
  });
});
