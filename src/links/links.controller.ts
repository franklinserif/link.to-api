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
import { LinksService } from '@links/links.service';
import { CreateLinkDto, UpdateLinkDto } from '@links/dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '@auth/decorators/get-user.decorator';
import { User } from '@users/entities/user.entity';
import { VisitorInformation } from '@shared/interfaces/visitor';
import { GetVisitor } from '@visits/decorators/get-visitor.decorator';

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  async create(
    @Body() createLinkDto: CreateLinkDto,
    @GetUser() user: User | undefined,
  ) {
    return this.linksService.create(createLinkDto, user);
  }

  @Get()
  @UseGuards(AuthGuard())
  async findAll() {
    return this.linksService.findAll();
  }

  @Get(':id')
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
  @UseGuards(AuthGuard())
  async update(@Param('id') id: string, @Body() updateLinkDto: UpdateLinkDto) {
    return this.linksService.update(id, updateLinkDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async remove(@Param('id') id: string) {
    return this.linksService.remove(id);
  }
}
