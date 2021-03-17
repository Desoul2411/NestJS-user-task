
import { Controller, Body, Get, Post, HttpCode, HttpStatus, Header} from '@nestjs/common';
import { CreateUserDataDto } from './dto/create-user-data.dto';
import { User } from './user.entity';
import { UsersDataService } from './users.service';


@Controller('api/v1/user')
export class UsersController {
    constructor(private readonly userDataService:  UsersDataService) { }

    @Get() 
    findAll() {
        return this.userDataService.findAll();
    }

    @Post()// to delete elment - POST method
    @HttpCode(HttpStatus.CREATED) // res with status 201
   // @Header('Cache-Control', 'none') // set header
    create(@Body() createProductDto: CreateUserDataDto): Promise<User> {
        return this.userDataService.create(createProductDto)
    }
}







