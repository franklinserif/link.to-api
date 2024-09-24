import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LinksService } from '@links/links.service';
import { GetUser } from '@auth/decorators/get-user.decorator';
import { CreateLinkDto, UpdateLinkDto } from '@links/dto';
import { User } from '@users/entities/user.entity';
import { VisitorInformation } from '@shared/interfaces/visitor';
import { GetVisitor } from '@visits/decorators/get-visitor.decorator';
import { AuthGuardedOperation, PublicOperation } from '@shared/decorators';

@ApiTags('Links')
@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Get()
  @AuthGuardedOperation('Get all links (Authenticated users only)', [
    ApiResponse({ status: 200, description: 'List of all links.' }),
  ])
  async findAll() {
    return this.linksService.findAll();
  }

  @Get(':id')
  @PublicOperation('Get the original URL by its shortened ID', [
    ApiParam({ name: 'id', description: 'The ID of the shortened link' }),
    ApiResponse({
      status: 302,
      description: 'Redirected to the original URL.',
    }),
    ApiResponse({ status: 404, description: 'Link not found.' }),
  ])
  async findOne(
    @Param('id') id: string,
    @GetVisitor() visitor: VisitorInformation,
    @Res() res: Response,
  ) {
    const link = await this.linksService.findOriginalUrl(id, visitor);

    if (!link.status) {
      return res.status(404).redirect('/');
    }

    return res.redirect(link.urlOriginal);
  }

  @Post()
  @PublicOperation('Create a new shortened link', [
    ApiResponse({ status: 201, description: 'Link successfully created.' }),
    ApiResponse({ status: 400, description: 'Invalid input.' }),
  ])
  async create(
    @Body() createLinkDto: CreateLinkDto,
    @GetUser() user: User | undefined,
  ) {
    return this.linksService.create(createLinkDto, user);
  }

  @Patch(':id')
  @AuthGuardedOperation('Update an existing link')
  async update(@Param('id') id: string, @Body() updateLinkDto: UpdateLinkDto) {
    return this.linksService.update(id, updateLinkDto);
  }

  @Delete(':id')
  @AuthGuardedOperation('Delete a link')
  async remove(@Param('id') id: string) {
    return this.linksService.remove(id);
  }
}
