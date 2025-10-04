import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Storage')
@Controller('storage')
export class StorageController {
  private readonly uploadPath = join(process.cwd(), 'uploads');

  @Get('avatars/:filename')
  @ApiOperation({
    summary: 'Get avatar file',
    description: 'Serve avatar image files'
  })
  @ApiParam({
    name: 'filename',
    description: 'Avatar filename',
    example: '1696420398754-abc123-avatar.jpg'
  })
  @ApiResponse({
    status: 200,
    description: 'Avatar file served successfully',
    schema: {
      type: 'string',
      format: 'binary',
      description: 'Avatar image file'
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Avatar file not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Avatar not found' }
      }
    }
  })
  async getAvatar(@Param('filename') filename: string, @Res() res: Response) {
    try {
      const filePath = join(this.uploadPath, 'avatars', filename);

      if (!existsSync(filePath)) {
        throw new NotFoundException('File not found');
      }

      const mimeType = this.getMimeType(filename);

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Cache-Control', 'public, max-age=31536000');

      return res.sendFile(filePath);
    } catch (error) {
      throw new NotFoundException('Avatar not found');
    }
  }

  @Get('messages/:filename')
  @ApiOperation({
    summary: 'Get message file',
    description: 'Serve message attachment files'
  })
  @ApiParam({
    name: 'filename',
    description: 'Message file name',
    example: '1696420398754-def456-document.pdf'
  })
  @ApiResponse({
    status: 200,
    description: 'Message file served successfully',
    schema: {
      type: 'string',
      format: 'binary',
      description: 'Message attachment file'
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Message file not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'File not found' }
      }
    }
  })
  async getMessageFile(@Param('filename') filename: string, @Res() res: Response) {
    try {
      const filePath = join(this.uploadPath, 'messages', filename);

      if (!existsSync(filePath)) {
        throw new NotFoundException('File not found');
      }

      const mimeType = this.getMimeType(filename);

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Cache-Control', 'public, max-age=86400');

      if (!mimeType.startsWith('image/') && !mimeType.startsWith('audio/') && !mimeType.startsWith('video/')) {
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      }

      return res.sendFile(filePath);
    } catch (error) {
      throw new NotFoundException('File not found');
    }
  }

  private getMimeType(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();

    const mimeTypes: { [key: string]: string } = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'txt': 'text/plain',
      'zip': 'application/zip',
      'rar': 'application/x-rar-compressed',
    };

    return mimeTypes[extension || ''] || 'application/octet-stream';
  }
}
