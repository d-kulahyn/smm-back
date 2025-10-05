"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let EmailService = class EmailService {
    constructor(configService) {
        this.configService = configService;
    }
    async sendProjectInvitationEmail(data) {
        console.log('📧 Sending project invitation email:', {
            to: data.email,
            subject: `Invitation to join project: ${data.projectName}`,
            html: this.generateInvitationEmailTemplate(data)
        });
    }
    generateInvitationEmailTemplate(data) {
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
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map