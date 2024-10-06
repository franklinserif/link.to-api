import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinksService } from '@links/links.service';
import { LinksController } from '@links/links.controller';
import { Link } from '@links/entities/link.entity';
import { VisitsModule } from '@visits/visits.module';
import { AuthModule } from '@auth/auth.module';

@Module({
  controllers: [LinksController],
  providers: [LinksService],
  imports: [TypeOrmModule.forFeature([Link]), VisitsModule, AuthModule],
  exports: [LinksService],
})
export class LinksModule {}
