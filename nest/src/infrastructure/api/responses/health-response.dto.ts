import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({ example: 'ok' })
  status: string;

  @ApiProperty({ example: '2024-10-04T10:21:42.177Z' })
  timestamp: string;

  @ApiProperty({ example: 125.960380934 })
  uptime: number;

  @ApiProperty({
    type: 'object',
    properties: {
      rss: { type: 'number', example: 131166208 },
      heapTotal: { type: 'number', example: 45330432 },
      heapUsed: { type: 'number', example: 39939072 },
      external: { type: 'number', example: 20819384 },
      arrayBuffers: { type: 'number', example: 18320745 }
    }
  })
  memory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
    arrayBuffers: number;
  };

  @ApiProperty({ example: 'v22.20.0' })
  version: string;

  @ApiProperty({ example: 'development' })
  environment: string;
}
