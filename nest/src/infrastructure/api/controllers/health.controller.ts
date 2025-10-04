import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor() {
    console.log('HealthController');
  }

  @Get()
  @ApiOperation({
    summary: 'Health check endpoint',
    description: 'Returns the health status of the application'
  })
  @ApiResponse({
    status: 200,
    description: 'Health check successful',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        timestamp: { type: 'string' },
        uptime: { type: 'number' },
        memory: { type: 'object' },
        version: { type: 'string' },
        environment: { type: 'string' }
      }
    }
  })
  check() {
    console.log('Health check endpoint');
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version,
      environment: process.env.NODE_ENV || 'development'
    };
  }

  @Get('ready')
  @ApiOperation({
    summary: 'Readiness check',
    description: 'Check if the application is ready to serve requests'
  })
  @ApiResponse({
    status: 200,
    description: 'Application is ready',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        timestamp: { type: 'string' }
      }
    }
  })
  ready() {
    return {
      status: 'ready',
      timestamp: new Date().toISOString()
    };
  }

  @Get('live')
  @ApiOperation({
    summary: 'Liveness check',
    description: 'Check if the application is alive'
  })
  @ApiResponse({
    status: 200,
    description: 'Application is alive',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        timestamp: { type: 'string' }
      }
    }
  })
  live() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString()
    };
  }
}
