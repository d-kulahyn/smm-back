import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard, RequireAnyPermission, Permission } from '../../../shared';
import { AuthenticatedRequest } from '../../../shared';

import { CreateFileGroupUseCase } from '../../../application/use-cases/create-file-group.use-case';
import { UpdateFileGroupUseCase, DeleteFileGroupUseCase } from '../../../application/use-cases/update-file-group.use-case';
import { FileGroupRepository } from '../../../domain/repositories/file-group.repository';
import { FileGroupResource } from '../resources/file-group-resource.dto';

import { CreateFileGroupDto, UpdateFileGroupDto } from '../requests/file-group.dto';
import {
  FileGroupCreateResponseDto,
  FileGroupListResponseDto,
  FileGroupResponseDto,
} from '../responses/file-group-response.dto';
import { ErrorResponseDto } from '../responses/error-response.dto';

import {
  ResourceNotFoundException,
  AccessDeniedException,
} from '../../../shared/exceptions';
import { Inject } from '@nestjs/common';

@ApiTags('File Groups')
@Controller('file-groups')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class FileGroupController {
  constructor(
    private readonly createFileGroupUseCase: CreateFileGroupUseCase,
    private readonly updateFileGroupUseCase: UpdateFileGroupUseCase,
    private readonly deleteFileGroupUseCase: DeleteFileGroupUseCase,
    @Inject('FILE_GROUP_REPOSITORY')
    private readonly fileGroupRepository: FileGroupRepository,
  ) {}

  @Post()
  @RequireAnyPermission(Permission.UPLOAD_MEDIA, Permission.VIEW_ALL_MEDIA)
  @ApiOperation({
    summary: 'Create a new file group',
    description: 'Create a new file group for organizing files within a specific entity (project, task, etc.)'
  })
  @ApiBody({
    type: CreateFileGroupDto,
    description: 'File group data to create'
  })
  @ApiResponse({
    status: 201,
    description: 'File group created successfully',
    type: FileGroupCreateResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data',
    type: ErrorResponseDto
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
    type: ErrorResponseDto
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - No permission to create file groups',
    type: ErrorResponseDto
  })
  async create(
    @Body() createFileGroupDto: CreateFileGroupDto,
    @Request() req: AuthenticatedRequest
  ) {
    const fileGroup = await this.createFileGroupUseCase.execute({
      ...createFileGroupDto,
      createdBy: req.user.userId,
    });

    return {
      success: true,
      message: 'File group created successfully',
      data: FileGroupResource.fromEntity(fileGroup),
    };
  }

  @Get()
  @RequireAnyPermission(Permission.VIEW_ALL_MEDIA, Permission.UPLOAD_MEDIA)
  @ApiOperation({
    summary: 'Get file groups by entity',
    description: 'Retrieve all file groups associated with a specific entity (project, task, etc.)'
  })
  @ApiQuery({
    name: 'entityType',
    description: 'Type of the entity (e.g., project, task, message)',
    example: 'project',
    required: true
  })
  @ApiQuery({
    name: 'entityId',
    description: 'Unique identifier of the entity',
    example: 'clm1project123456',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'File groups retrieved successfully',
    type: FileGroupListResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Missing required query parameters',
    type: ErrorResponseDto
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
    type: ErrorResponseDto
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - No permission to view file groups',
    type: ErrorResponseDto
  })
  async getByEntity(
    @Query('entityType') entityType: string,
    @Query('entityId') entityId: string,
  ) {
    if (!entityType || !entityId) {
      throw new Error('entityType and entityId are required');
    }

    const fileGroups = await this.fileGroupRepository.findByEntity(entityType, entityId);

    return {
      success: true,
      data: FileGroupResource.collection(fileGroups),
    };
  }

  @Get(':id')
  @RequireAnyPermission(Permission.VIEW_ALL_MEDIA, Permission.UPLOAD_MEDIA)
  @ApiOperation({
    summary: 'Get file group by ID',
    description: 'Retrieve detailed information about a specific file group'
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the file group',
    example: 'clm1filegroup123456'
  })
  @ApiResponse({
    status: 200,
    description: 'File group retrieved successfully',
    type: FileGroupResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'File group not found',
    type: ErrorResponseDto
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
    type: ErrorResponseDto
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - No permission to view file groups',
    type: ErrorResponseDto
  })
  async getById(@Param('id') id: string) {
    const fileGroup = await this.fileGroupRepository.findById(id);

    if (!fileGroup) {
      throw new ResourceNotFoundException('File group', id);
    }

    return {
      success: true,
      data: FileGroupResource.fromEntity(fileGroup),
    };
  }

  @Put(':id')
  @RequireAnyPermission(Permission.UPLOAD_MEDIA, Permission.VIEW_ALL_MEDIA)
  @ApiOperation({
    summary: 'Update file group',
    description: 'Update name, description or other properties of an existing file group'
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the file group to update',
    example: 'clm1filegroup123456'
  })
  @ApiBody({
    type: UpdateFileGroupDto,
    description: 'Updated file group data'
  })
  @ApiResponse({
    status: 200,
    description: 'File group updated successfully',
    type: FileGroupResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data',
    type: ErrorResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'File group not found',
    type: ErrorResponseDto
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
    type: ErrorResponseDto
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - No permission to edit this file group',
    type: ErrorResponseDto
  })
  async update(
    @Param('id') id: string,
    @Body() updateFileGroupDto: UpdateFileGroupDto,
    @Request() req: AuthenticatedRequest
  ) {
    const fileGroup = await this.updateFileGroupUseCase.execute({
      id,
      ...updateFileGroupDto,
      updatedBy: req.user.userId,
    });

    return {
      success: true,
      message: 'File group updated successfully',
      data: FileGroupResource.fromEntity(fileGroup),
    };
  }

  @Delete(':id')
  @RequireAnyPermission(Permission.DELETE_ANY_MEDIA, Permission.UPLOAD_MEDIA)
  @ApiOperation({
    summary: 'Delete file group',
    description: 'Delete an existing file group. Note: This will not delete the files themselves, only remove the grouping.'
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the file group to delete',
    example: 'clm1filegroup123456'
  })
  @ApiResponse({
    status: 200,
    description: 'File group deleted successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'File group deleted successfully' }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'File group not found',
    type: ErrorResponseDto
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
    type: ErrorResponseDto
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - No permission to delete this file group',
    type: ErrorResponseDto
  })
  async delete(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest
  ) {
    await this.deleteFileGroupUseCase.execute(id, req.user.userId);

    return {
      success: true,
      message: 'File group deleted successfully',
    };
  }
}
