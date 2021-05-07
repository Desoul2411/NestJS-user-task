import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDataDto {
  @ApiProperty() // for Swagger
  @IsString()
  @IsNotEmpty()
  userName!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userOldPassword!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userNewPassword!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  signature: string;
}
