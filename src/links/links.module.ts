import { Module } from '@nestjs/common';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from '@links/entities/link.entity';
import { VisitsModule } from '@visits/visits.module';
import { AuthModule } from '@auth/auth.module';

@Module({
  controllers: [LinksController],
  providers: [LinksService],
  imports: [TypeOrmModule.forFeature([Link]), VisitsModule, AuthModule],
})
export class LinksModule {}
