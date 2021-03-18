
import { Controller, Body, Get, Post, HttpCode, HttpStatus, Header,Req, UseGuards} from '@nestjs/common';
import { CreateUserDataDto } from './dto/create-user-data.dto';
import { User } from './user.entity';
import { UsersDataService } from './users.service';
import { Request } from 'express';
import { SignatureGuard } from './guards/signature.guard';


@Controller('api/v1/user')
export class UsersController {
    constructor(private readonly userDataService:  UsersDataService) { }

    @Get() 
    findAll() {
        return this.userDataService.findAll();
    }

    @Post()// to delete elment - POST method
    //@HttpCode(HttpStatus.CREATED) // res with status 201
   // @Header('Cache-Control', 'none') // set header
    @UseGuards(SignatureGuard)
    create(@Body() createProductDto: CreateUserDataDto, @Req() request: Request): Promise<User> {
        return this.userDataService.create(createProductDto,request)
    }
}







