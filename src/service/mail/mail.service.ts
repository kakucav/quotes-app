import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailService: MailerService) {}

  async sendWelcomeMail(username: string, email: string): Promise<void> {
    await this.mailService.sendMail({
      to: email,
      subject: 'Welcome to our app!',
      template: './welcome/',
      context: {
        username,
      },
    });
  }

  async sendPasswordResetMail(
    username: string,
    email: string,
    code: number,
  ): Promise<void> {
    await this.mailService.sendMail({
      to: email,
      subject: 'Password Reset',
      template: './reset-password/',
      context: {
        username,
        code,
      },
    });
  }
}
