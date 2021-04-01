import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse403 {
  @ApiProperty({
    default: 403
  })
  statusCode: number;
  @ApiProperty({
    default:"Access forbidden"
  })
  message: string;
}

export class ErrorResponse404 {
  @ApiProperty({
    default: 404
  })
  statusCode: number;
  @ApiProperty({
    default:"Not found"
  })
  message: string;
}

export class ErrorResponse400 {
  @ApiProperty({
    default: 404
  })
  statusCode: number;
  @ApiProperty({
    default:"Validation failed"
  })
  message: string;
}
