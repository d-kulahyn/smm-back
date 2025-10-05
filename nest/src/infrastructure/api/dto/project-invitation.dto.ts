import { IsEmail, IsOptional, IsEnum, IsArray, IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
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

export class SendProjectInvitationUseCaseDto {
  projectId: string;
  invitedBy: string;
  invitedEmail?: string;
  role: ProjectRole;
  permissions?: string[];
}

export class AcceptProjectInvitationUseCaseDto {
  token: string;
  userId: string;
}

export class PaginationDto {
  @ApiPropertyOptional({ description: 'Page number', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', example: 15 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  perPage?: number = 15;
}
