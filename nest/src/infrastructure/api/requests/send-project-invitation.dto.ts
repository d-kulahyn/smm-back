import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsEnum, IsArray } from 'class-validator';
import { ProjectRole } from '@prisma/client';

export class SendProjectInvitationDto {
  @ApiPropertyOptional({
    description: 'Email of the user to invite',
    example: 'user@example.com'
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Role in the project',
    enum: ProjectRole,
    example: ProjectRole.member
  })
  @IsEnum(ProjectRole)
  role: ProjectRole;

  @ApiPropertyOptional({
    description: 'Array of permissions',
    type: [String],
    example: ['read', 'write']
  })
  @IsOptional()
  @IsArray()
  permissions?: string[];
}
