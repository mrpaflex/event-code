import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ENVIRONMENT } from 'src/common/constants/environment/env.variable';
import { MailService } from './mail.service';
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: ENVIRONMENT.SMTP.SMTP_USER,
          pass: ENVIRONMENT.SMTP.AUTH_PASS,
        },
      },

      defaults: {
        from: '"Event Drive Support" <support@event-drive>',
      },
    }),
  ],
  controllers: [],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
