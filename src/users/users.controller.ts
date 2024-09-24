import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from '@users/users.service';
import { UpdateUserDto } from '@users/dto';
import { AuthGuardedOperation } from '@shared/decorators';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @AuthGuardedOperation('Retrieve all users', [
    ApiResponse({ status: 200, description: 'List of all users.' }),
  ])
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @AuthGuardedOperation('Get a user by ID', [
    ApiParam({ name: 'id', description: 'The ID of the user to retrieve' }),
    ApiResponse({ status: 404, description: 'User not found.' }),
  ])
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @AuthGuardedOperation('Update a user by ID')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @AuthGuardedOperation('Delete a user by ID')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
