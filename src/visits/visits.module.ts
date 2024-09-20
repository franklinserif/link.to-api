import { Module } from '@nestjs/common';
import { VisitsService } from '@visits/visits.service';
import { VisitsController } from '@visits/visits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visit } from '@visits/entities/visit.entity';

@Module({
  controllers: [VisitsController],
  providers: [VisitsService],
  imports: [TypeOrmModule.forFeature([Visit])],
})
export class VisitsModule {}
