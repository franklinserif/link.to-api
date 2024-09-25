import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '@users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from '@config/configuration';
import { LoggerMiddleware } from '@shared/middlewares/logger/logger.middleware';
import { LinksModule } from '@links/links.module';
import { VisitsModule } from '@visits/visits.module';
import { AuthModule } from '@auth/auth.module';
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
