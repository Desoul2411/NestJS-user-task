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
import { ErrorResponse } from './error.type';
import { CreateUserUseCase, CreateUserUseCaseSymbol } from 'src/domains/ports/in/create-user.use-case';
import { CreateUserCommand } from 'src/domains/ports/in/create-user.command';
import { UserOrmEntity } from '../user-persistence/user.orm.entity';



@Controller('user')
export class UsersController {
  constructor(@Inject(CreateUserUseCaseSymbol) private readonly _userService: CreateUserUseCase) {}

  @Post()
  async createUser(
    @Body(new ValidationPipe()) createUserDataDto: CreateUserDataDto,
  ): Promise<UserOrmEntity> {

/*     const { userName, userNewPassword } = createUserDataDto; */
 

    const createUserCommand = new CreateUserCommand(
      createUserDataDto
    )

    return this._userService.createUser(createUserCommand);
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
