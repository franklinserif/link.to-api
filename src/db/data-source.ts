import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Link } from '@links/entities/link.entity';
import { User } from '@users/entities/user.entity';
import { Visit } from '@visits/entities/visit.entity';

ConfigModule.forRoot({
  isGlobal: true,
});

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST') || 'localhost',
  port: parseInt(configService.get<string>('DATABASE_PORT') || '5432', 10),
  username: configService.get<string>('DATABASE_USER') || 'root',
  password: configService.get<string>('DATABASE_USER_PASSWORD') || 'password',
  database: configService.get<string>('DATABASE_NAME') || 'test',
  entities: [User, Link, Visit],
  synchronize: false,
};

const dataSource = new DataSource({
  ...dataSourceOptions,
  migrations: ['src/db/migrations/*.ts'],
});

export default dataSource;
