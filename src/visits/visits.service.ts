import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateVisitDto } from '@visits/dto';
import { Visit } from '@visits/entities/visit.entity';
import { Repository } from 'typeorm';
@Injectable()
export class VisitsService {
  constructor(
    @InjectRepository(Visit)
    private readonly visitsRepository: Repository<Visit>,
  ) {}

  async create(createVisitDto: CreateVisitDto): Promise<Visit> {
    try {
      const visitor = this.visitsRepository.create(createVisitDto);

      await this.visitsRepository.save(visitor);
      return visitor;
    } catch (error) {
      throw new BadRequestException(`Failed to create visit`);
    }
  }
}
