import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LinksService } from '@links/links.service';
import { GetUser } from '@auth/decorators/get-user.decorator';
import { CreateLinkDto, UpdateLinkDto } from '@links/dto';
import { User } from '@users/entities/user.entity';
import { VisitorInformation } from '@shared/interfaces/visitor';
import { GetVisitor } from '@visits/decorators/get-visitor.decorator';

@ApiTags('Links')
@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new shortened link' })
  @ApiResponse({ status: 201, description: 'Link successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(
    @Body() createLinkDto: CreateLinkDto,
    @GetUser() user: User | undefined,
  ) {
    return this.linksService.create(createLinkDto, user);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Get all links (Authenticated users only)' })
  @ApiResponse({ status: 200, description: 'List of all links.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UseGuards(AuthGuard())
  async findAll() {
    return this.linksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get the original URL by its shortened ID' })
  @ApiParam({ name: 'id', description: 'The ID of the shortened link' })
  @ApiResponse({ status: 302, description: 'Redirected to the original URL.' })
  @ApiResponse({ status: 404, description: 'Link not found.' })
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

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Update an existing link' })
  @ApiParam({ name: 'id', description: 'The ID of the link to update' })
  @ApiResponse({ status: 200, description: 'Link successfully updated.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UseGuards(AuthGuard())
  async update(@Param('id') id: string, @Body() updateLinkDto: UpdateLinkDto) {
    return this.linksService.update(id, updateLinkDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Delete a link' })
  @ApiParam({ name: 'id', description: 'The ID of the link to delete' })
  @ApiResponse({ status: 200, description: 'Link successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Link not found.' })
  @UseGuards(AuthGuard())
  async remove(@Param('id') id: string) {
    return this.linksService.remove(id);
  }
}
