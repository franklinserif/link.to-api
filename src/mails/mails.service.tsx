import * as React from 'react';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { render } from '@react-email/render';
import TemplateOTP from '@mails/templates/TemplateOTP';
import { ErrorManager } from '@shared/exceptions/ExceptionManager';

@Injectable()
export class MailsService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail({
    email,
    subject,
    template,
  }: {
    email: string;
    subject: string;
    template: string;
  }) {
    try {
      await this.mailerService.sendMail({
        from: 'LinkTo Team <linktoteam@gmail.com>',
        to: email,
        subject: subject,
        html: template,
      });

      return { message: 'mail was sent' };
    } catch (error) {
      throw new ErrorManager(error);
    }
  }

  async sendResetPassword({
    email,
    name,
    code,
  }: {
    email: string;
    name: string;
    code: string;
  }) {
    try {
      const template = await render(<TemplateOTP name={name} code={code} />);
      const result = await this.sendEmail({
        email,
        subject: 'Your OTP Code for reset password',
        template,
      });
      return result;
    } catch (error) {
      throw new ErrorManager(error);
    }
  }
}
