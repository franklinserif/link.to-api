import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { LinksService } from '@links/links.service';
import { CreateLinkDto, UpdateLinkDto } from '@links/dto';
import { getVisitorInformation } from '@libs/visitor';
import { GetUser } from '@auth/decorators/get-user.decorator';
import { User } from '@users/entities/user.entity';

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  async create(
    @Body() createLinkDto: CreateLinkDto,
    @GetUser() user: User | undefined,
  ) {
    return await this.linksService.create(createLinkDto, user);
  }

  @Get()
  findAll() {
    return this.linksService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const visitorImformation = await getVisitorInformation(req);
    const link = await this.linksService.findOriginalUrl(
      id,
      visitorImformation,
    );

    if (!link.status) {
      return res.status(404).redirect('/');
    }

    return res.redirect(link.urlOriginal);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLinkDto: UpdateLinkDto) {
    return this.linksService.update(id, updateLinkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.linksService.remove(id);
  }
}
