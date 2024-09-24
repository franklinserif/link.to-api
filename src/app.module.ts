import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '@users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from '@config/configuration';
import { User } from '@users/entities/user.entity';
import { LoggerMiddleware } from '@shared/middlewares/logger/logger.middleware';
import { LinksModule } from '@links/links.module';
import { Link } from '@links/entities/link.entity';
import { VisitsModule } from '@visits/visits.module';
import { Visit } from '@visits/entities/visit.entity';
import { AuthModule } from '@auth/auth.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        entities: [User, Link, Visit],
        synchronize: true,
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
