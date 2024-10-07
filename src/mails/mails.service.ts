import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { render } from '@react-email/render';
import Welcome from './templates/welcome';
import { ErrorManager } from '@shared/exceptions/ExceptionManager';

@Injectable()
export class MailsService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail() {
    const template = await render(Welcome());
    try {
      await this.mailerService.sendMail({
        from: 'Kingsley Okure <kingsleyokgeorge@gmail.com>',
        to: 'franklinserif@gmail.com',
        subject: 'reset password test',
        html: template,
      });

      return { message: 'mail was sent' };
    } catch (error) {
      console.log('error: ', error);
      throw new ErrorManager(error);
    }
  }
}
