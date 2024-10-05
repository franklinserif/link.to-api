import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LinksService } from '@links/links.service';
import { VisitorInformation } from '@shared/interfaces/visitor';
import { GetVisitor } from '@visits/decorators/get-visitor.decorator';
import { PublicOperation } from '@shared/decorators';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly linksService: LinksService) {}

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
}
