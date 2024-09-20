import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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

  async create(createLinkDto: CreateLinkDto) {
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
      return await this.linksRepository.find();
    } catch (error) {
      this.logger.error(error.details);
      throw new BadRequestException(error.details);
    }
  }

  async findOne(id: string) {
    try {
      return await this.linksRepository.findOne({ where: { id } });
    } catch (error) {
      this.logger.error(error.details);
      throw new BadRequestException(error.details);
    }
  }

  async update(id: string, updateLinkDto: UpdateLinkDto) {
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
}
