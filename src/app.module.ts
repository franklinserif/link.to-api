import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    ConfigModule.forRoot({
      load: [configuration],
    }),
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
