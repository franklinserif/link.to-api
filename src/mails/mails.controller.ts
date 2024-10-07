import { Controller, Get } from '@nestjs/common';
import { MailsService } from './mails.service';

@Controller('mails')
export class MailsController {
  constructor(private readonly mailsService: MailsService) {}

  @Get('send-mail')
  async sendEmail() {
    return this.mailsService.sendMail();
  }
}
