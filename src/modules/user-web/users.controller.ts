import {
  Controller,
  Body,
  Get,
  Post,
  UseGuards,
  Put,
  Param,
  Inject,
} from '@nestjs/common';
import { CreateUserDataDto } from './dto/create-user-data.dto';
/* import { UsersDataService } from './users.service'; */
import { SignatureGuard } from './guards/signature.guard';
import { ValidationPipe } from './validation.pipe';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorResponse403, ErrorResponse404, ErrorResponse400 } from './error.type';
import { CreateUserUseCase, CreateUserUseCaseSymbol } from 'src/domains/ports/in/create-user.use-case';
import { CreateUserCommand } from 'src/domains/ports/in/create-user.command';
import { UserOrmEntity } from '../user-persistence/user.orm.entity';
import { UpdateUserUseCase, UpdateUserUseCaseSymbol } from 'src/domains/ports/in/update-user.use-case';
import { UpdateUserCommand } from 'src/domains/ports/in/update-user.command';



@Controller('user')
export class UsersController {
  constructor(
    @Inject(CreateUserUseCaseSymbol) private readonly _createUserService: CreateUserUseCase,
    @Inject(UpdateUserUseCaseSymbol) private readonly _userService: UpdateUserUseCase,
  ) {}


  @ApiResponse({
    status: 200,
    description: 'User updated',
    type: UserOrmEntity, // User - array []
  })
  @ApiResponse({
    status: 403,
    description: 'Access forbidden',
    type: ErrorResponse403,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed',
    type: ErrorResponse400,
  })
  @ApiBody({ type: CreateUserDataDto }) // for Swagger
  @Post()
  async createUser(@Body(new ValidationPipe()) createUserDataDto: CreateUserDataDto,): Promise<UserOrmEntity> {

    const createUserCommand = new CreateUserCommand(
      createUserDataDto
    )

    return this._createUserService.createUser(createUserCommand);
  }


  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'Password updated',
    type: UserOrmEntity, 
  })
  @ApiResponse({
    status: 403,
    description: 'Access forbidden',
    type: ErrorResponse403,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed',
    type: ErrorResponse400,
  })
  @ApiBody({ type: CreateUserDataDto })
  //@UseGuards(SignatureGuard)
  async updateUser(
    @Param('id') id: number,
    @Body(new ValidationPipe()) createUserDataDto: CreateUserDataDto,
  ): Promise<UserOrmEntity> {
    const updateUserCommand = new UpdateUserCommand(
      id,
      createUserDataDto
    )

    return this._userService.updateUser(updateUserCommand);
  }
}


























/* @ApiTags('user')
@Controller('user')
export class UsersController {
  constructor(private readonly userDataService: UsersDataService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'get all users',
    type: [UserOrmEntity], // User - array []
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    type: ErrorResponse,
  })
  findAll(): Promise<UserOrmEntity[]> {
    return this.userDataService.findAll();
  }
 

  @Post()
  @ApiResponse({
    status: 201,
    description: 'user created',
    type: UserOrmEntity, // User - array []
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
  create(
    @Body(new ValidationPipe()) createProductDto: CreateUserDataDto,
  ): Promise<UserOrmEntity> {
    return this.userDataService.create(createProductDto);
  }


  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'Password updated',
    type: UserOrmEntity, 
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
  @UseGuards(SignatureGuard)
  update(
    @Param('id') id: number,
    @Body(new ValidationPipe()) createProductDto: CreateUserDataDto,
  ): Promise<UserOrmEntity> {
    return this.userDataService.update(id,createProductDto);
  }
} */
