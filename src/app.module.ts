import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '@users/users.module';
import configuration from '@config/configuration';
import { LoggerMiddleware } from '@shared/middlewares/logger/logger.middleware';
import { LinksModule } from '@links/links.module';
import { VisitsModule } from '@visits/visits.module';
import { AuthModule } from '@auth/auth.module';
import { MailsModule } from '@mails/mails.module';
import { AppController } from './app.controller';
import { dataSourceOptions } from '@db/data-source';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        ...dataSourceOptions,
      }),
    }),
    LinksModule,
    VisitsModule,
    AuthModule,
    MailsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
