import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt } from 'class-validator';

export class CreateUserDataDto {
  @ApiProperty()// for Swagger
  @IsString()
  userName: string;

  @ApiProperty()
  @IsString()
  userOldPassword: string;

  @ApiProperty()
  @IsString()
  userNewPassword: string;

  @ApiProperty()
  @IsString()
  signature: string;
}
