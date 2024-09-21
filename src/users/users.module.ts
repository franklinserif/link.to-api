import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '@users/users.service';
import { UsersController } from '@users/users.controller';
import { User } from '@users/entities/user.entity';
import { AuthModule } from '@auth/auth.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
})
export class UsersModule {}
