import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface SendInvitationEmailData {
  email: string;
  projectName: string;
  inviterName: string;
  acceptUrl: string;
  declineUrl: string;
  role: string;
}

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  async sendProjectInvitationEmail(data: SendInvitationEmailData): Promise<void> {
    // TODO: Интеграция с вашим email провайдером (SendGrid, Mailgun, Nodemailer и т.д.)
    // Пока что просто логируем для демонстрации
    console.log('📧 Sending project invitation email:', {
      to: data.email,
      subject: `Invitation to join project: ${data.projectName}`,
      html: this.generateInvitationEmailTemplate(data)
    });

    // В реальном проекте здесь будет отправка через email-сервис:
    /*
    await this.mailService.send({
      to: data.email,
      subject: `Invitation to join project: ${data.projectName}`,
      html: this.generateInvitationEmailTemplate(data)
    });
    */
  }

  private generateInvitationEmailTemplate(data: SendInvitationEmailData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Project Invitation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #007bff; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 10px 20px; margin: 10px 5px; text-decoration: none; border-radius: 5px; font-weight: bold; }
          .accept { background: #28a745; color: white; }
          .decline { background: #dc3545; color: white; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Project Invitation</h1>
          </div>
          <div class="content">
            <h2>Hello!</h2>
            <p><strong>${data.inviterName}</strong> has invited you to join the project <strong>${data.projectName}</strong> as a <strong>${data.role}</strong>.</p>
            
            <p>You can accept or decline this invitation using the buttons below:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.acceptUrl}" class="button accept">✅ Accept Invitation</a>
              <a href="${data.declineUrl}" class="button decline">❌ Decline Invitation</a>
            </div>
            
            <p><strong>Note:</strong> This invitation will expire in 7 days.</p>
          </div>
          <div class="footer">
            <p>If you're having trouble clicking the buttons, copy and paste the URLs below into your web browser:</p>
            <p>Accept: ${data.acceptUrl}</p>
            <p>Decline: ${data.declineUrl}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
