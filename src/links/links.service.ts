import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateLinkDto, UpdateLinkDto } from '@links/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Link } from '@links/entities/link.entity';
import { shortenURL } from '@libs/link';
import { VisitsService } from '@visits/visits.service';
import { User } from '@users/entities/user.entity';

@Injectable()
export class LinksService {
  private readonly logger: Logger = new Logger(LinksService.name);

  constructor(
    @InjectRepository(Link)
    private readonly linksRepository: Repository<Link>,
    private readonly visitsService: VisitsService,
  ) {}

  async findOriginalUrl(shortURL: string, visitor: VisitorInformation) {
    try {
      const link = await this.linksRepository.findOne({ where: { shortURL } });

      if (!link?.id) throw new NotFoundException('link not found');

      const { userAgent, geo } = visitor;

      await this.visitsService.create({
        os: userAgent.os.name,
        browser: userAgent.browser,
        country: geo.country,
        location: geo.location,
        ip: geo.ip,
        link,
      });

      return link;
    } catch (error) {
      this.logger.error(error.detail);
      throw new InternalServerErrorException(error.detail);
    }
  }

  async create(createLinkDto: CreateLinkDto, user: User | undefined) {
    try {
      const shortURL = await this.generateShortURL();

      let newLink: any = {
        ...createLinkDto,
        shortURL,
      };

      if (user?.id) {
        newLink = { ...newLink, user: user };
      }

      const link = this.linksRepository.create(newLink);

      await this.linksRepository.save(link);

      return link;
    } catch (error) {
      this.logger.error('Failed to create link ', error.detail);
      throw new InternalServerErrorException(
        'Failed to create link ',
        error.detail,
      );
    }
  }

  async update(id: string, updateLinkDto: UpdateLinkDto) {
    try {
      const shortURL = await this.generateShortURL();

      const link = await this.linksRepository.findOneBy({ id });

      link.urlOriginal = updateLinkDto.urlOriginal;
      link.shortURL = shortURL;

      return await this.linksRepository.save(link);
    } catch (error) {
      this.logger.error('Failed to update link ', error.detail);
      throw new InternalServerErrorException(
        'Failed to update link ',
        error.detail,
      );
    }
  }

  async remove(id: string) {
    try {
      const link = await this.linksRepository.findOne({ where: { id } });
      if (!link?.id)
        throw new NotFoundException(`link with id ${id} doesn't exist`);

      return await this.linksRepository.delete(id);
    } catch (error) {
      this.logger.error('Failed to delete link ', error.detail);
      throw new InternalServerErrorException(
        'Failed to delete link ',
        error.detail,
      );
    }
  }

  private async generateShortURL() {
    let shortURL = shortenURL();
    let shortUrlExist = true;

    while (shortUrlExist) {
      const sameShortLink = await this.linksRepository.findOne({
        where: { shortURL },
      });

      if (!sameShortLink?.id) {
        shortUrlExist = false;
      } else {
        shortURL = shortenURL();
      }
    }

    return shortURL;
    } catch (error) {
      this.logger.error('Failed to generate short link ', error.detail);
      throw new InternalServerErrorException(
        'Failed to generate short link ',
        error.detail,
      );
    }
  }

  private async checkExpireDate(link: Link): Promise<Link> {
    const currentDate = new Date();

    if (link.expirationDate > currentDate) {
      return link;
    }
    try {
    link.status = false;
    await this.linksRepository.save(link);
    return link;
    } catch (error) {
      this.logger.error('Failed to check expire date ', error.detail);
      throw new InternalServerErrorException(
        'Failed to check expire date ',
        error.detail,
      );
    }
  }
}
