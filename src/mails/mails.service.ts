import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ErrorManager } from '@shared/exceptions/ExceptionManager';

@Injectable()
export class MailsService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail() {
    try {
      const message = 'Forgot your password?';

      await this.mailerService.sendMail({
        from: 'Kingsley Okure <kingsleyokgeorge@gmail.com>',
        to: 'franklinserif@gmail.com',
        subject: 'reset password test',
        text: message,
      });

      return { message: 'mail was sent' };
    } catch (error) {
      throw new ErrorManager(error);
    }
  }
}
