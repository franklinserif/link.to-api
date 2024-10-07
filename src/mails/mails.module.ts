import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailsService } from '@mails/mails.service';
import { MailsController } from '@mails/mails.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [MailsController],
  providers: [MailsService],
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
      }),
    }),
  ],
  exports: [MailsService],
})
export class MailsModule {}
