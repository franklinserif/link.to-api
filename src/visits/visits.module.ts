import { Module } from '@nestjs/common';
import { VisitsService } from '@visits/visits.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visit } from '@visits/entities/visit.entity';

@Module({
  controllers: [],
  providers: [VisitsService],
  imports: [TypeOrmModule.forFeature([Visit])],
  exports: [VisitsService],
})
export class VisitsModule {}
