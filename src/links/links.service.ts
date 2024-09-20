import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateLinkDto, UpdateLinkDto } from '@links/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Link } from '@links/entities/link.entity';
import { shortenURL } from '@libs/link';

@Injectable()
export class LinksService {
  private readonly logger: Logger = new Logger(LinksService.name);

  constructor(
    @InjectRepository(Link)
    private readonly linksRepository: Repository<Link>,
  ) {}

  async findOriginalUrl(shortURL: string) {
    try {
      const link = await this.linksRepository.findOne({ where: { shortURL } });

      if (!link?.id) throw new NotFoundException('link not found');

      return link;
    } catch (error) {
      this.logger.error(error.details);
      throw new BadRequestException(error.details);
    }
  }

  async create(createLinkDto: CreateLinkDto) {
    try {
      const shortURL = await this.generateShortURL();

      const link = this.linksRepository.create({
        ...createLinkDto,
        shortURL,
      });

      await this.linksRepository.save(link);

      return link;
    } catch (error) {
      this.logger.error(error.details);
      throw new BadRequestException(error.details);
    }
  }

  async findAll() {
    try {
      const links = await this.linksRepository.find();
      let updatedLinks: Link[] = [];

      for (const link of links) {
        const updatedLink = await this.checkExpireDate(link);
        updatedLinks.push(updatedLink);
      }

      return updatedLinks;
    } catch (error) {
      this.logger.error(error.details);
      throw new BadRequestException(error.details);
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
      this.logger.error(error.details);
      throw new BadRequestException(error.details);
    }
  }

  async remove(id: string) {
    try {
      return await this.linksRepository.delete(id);
    } catch (error) {
      this.logger.error(error.details);
      throw new BadRequestException(error.details);
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
  }

  private async checkExpireDate(link: Link): Promise<Link> {
    const currentDate = new Date();

    if (link.expirationDate > currentDate) {
      return link;
    }

    link.status = false;
    await this.linksRepository.save(link);
    return link;
  }
}
