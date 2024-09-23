import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { CreateLinkDto, UpdateLinkDto } from '@links/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Link } from '@links/entities/link.entity';
import { shortenURL } from '@libs/link';
import { VisitsService } from '@visits/visits.service';
import { User } from '@users/entities/user.entity';
import { VisitorInformation } from '@shared/interfaces/visitor';

@Injectable()
export class LinksService {
  private readonly logger: Logger = new Logger(LinksService.name);

  constructor(
    @InjectRepository(Link)
    private readonly linksRepository: Repository<Link>,
    private readonly visitsService: VisitsService,
  ) {}

  async findAll(): Promise<Link[]> {
    try {
      const links = await this.linksRepository.find();
      const updatedLinks: Link[] = [];

      for (const link of links) {
        const updatedLink = await this.checkExpireDate(link);
        updatedLinks.push(updatedLink);
      }

      return updatedLinks;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('cannot find links');
    }
  }

  async findOriginalUrl(
    shortURL: string,
    visitor: VisitorInformation,
  ): Promise<Link> {
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
      this.logger.error(error);
      throw new InternalServerErrorException('cannot find original url');
    }
  }

  async create(
    createLinkDto: CreateLinkDto,
    user: User | undefined,
  ): Promise<Link> {
    try {
      const shortURL = await this.generateShortURL();

      let newLink = {
        ...createLinkDto,
        shortURL,
      } as Link;

      if (user?.id) {
        newLink = { ...newLink, user: user } as Link;
      }

      const link = this.linksRepository.create(newLink);

      return await this.linksRepository.save(link);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Failed to create link');
    }
  }

  async update(id: string, updateLinkDto: UpdateLinkDto): Promise<Link> {
    try {
      const shortURL = await this.generateShortURL();

      const link = await this.linksRepository.findOneBy({ id });

      if (!link?.id) {
        throw new NotFoundException(`link with id ${id} doesn't exist`);
      }

      link.urlOriginal = updateLinkDto.urlOriginal;
      link.shortURL = shortURL;

      return await this.linksRepository.save(link);
    } catch (error) {
      this.logger.error(error);

      if (error instanceof NotFoundException) {
        throw new NotFoundException(error);
      }

      throw new InternalServerErrorException('Failed to update link');
    }
  }

  async remove(id: string): Promise<DeleteResult> {
    try {
      const link = await this.linksRepository.findOne({ where: { id } });
      if (!link?.id)
        throw new NotFoundException(`link with id ${id} doesn't exist`);

      return await this.linksRepository.delete(id);
    } catch (error) {
      this.logger.error(error);

      if (error instanceof NotFoundException) {
        throw new NotFoundException(error);
      }

      throw new InternalServerErrorException('Failed to delete link');
    }
  }

  private async generateShortURL(): Promise<string> {
    try {
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
      this.logger.error(error);
      throw new InternalServerErrorException('Failed to generate short link');
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
      this.logger.error(error);
      throw new InternalServerErrorException('Failed to check expire date');
    }
  }
}
