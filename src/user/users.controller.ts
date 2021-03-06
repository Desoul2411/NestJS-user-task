import {
  Controller,
  Body,
  Get,
  Post,
  UseGuards,
  Put,
} from '@nestjs/common';
import { CreateUserDataDto } from './dto/create-user-data.dto';
import { User } from './user.entity';
import { UsersDataService } from './users.service';
import { SignatureGuard } from './guards/signature.guard';
import { ValidationPipe } from './validation.pipe';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorResponse } from './error.type';

@ApiTags('user')
@Controller('user')
export class UsersController {
  constructor(private readonly userDataService: UsersDataService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'get all users',
    type: [User], // User - array []
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    type: ErrorResponse,
  })
  findAll(): Promise<User[]> {
    return this.userDataService.findAll();
  }
  //@HttpCode(HttpStatus.CREATED) // res with status 201
  // @Header('Cache-Control', 'none') // set header

  @Post()
  @ApiResponse({
    status: 201,
    description: 'user created',
    type: User, // User - array []
  })
  @ApiResponse({
    status: 403,
    description: 'Access forbidden',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed',
    type: ErrorResponse,
  })
  @ApiBody({ type: CreateUserDataDto }) // for Swagger
  //@UseGuards(SignatureGuard)
  create(
    @Body(new ValidationPipe()) createProductDto: CreateUserDataDto,
  ): Promise<User> {
    return this.userDataService.create(createProductDto);
  }

  @Put()
  @ApiResponse({
    status: 200,
    description: 'Password updated',
    type: User, // User - array []
  })
  @ApiResponse({
    status: 403,
    description: 'Access forbidden',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed',
    type: ErrorResponse,
  })
  @ApiBody({ type: CreateUserDataDto })
  updatePassword(
    @Body(new ValidationPipe()) createProductDto: CreateUserDataDto,
  ): Promise<User> {
    return this.userDataService.updatePassword(createProductDto);
  }
}
