import { HttpStatus, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDataDto } from './dto/create-user-data.dto';
import { encrypt, decrypt } from '../utils/functions-helpers/cipher.utils';
import { factorial, fib } from '../utils/functions-helpers/math.utils';

require('dotenv').config();
const crypto = require('crypto');
const ENC_KEY = process.env.ENC_KEY;
const HASH_SECRET = process.env.HASH_SECRET;


@Injectable()
export class UsersDataService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private selectUserGroup = (
    userNameHashed: string,
    isSameNameUser: string | undefined,
  ): number => {
    const checkNumber = Math.abs(factorial(10) - fib(10));

    let group;

    if (checkNumber % 2 === 0) {
      group = 1;
    } else {
      group = isSameNameUser ? 2 : 3;
    }

    return group;
  };


  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async create(createUserDataDto: CreateUserDataDto): Promise<User> {
    const { userId, userName, userNewPassword } = createUserDataDto;

    //hash username
    const userNameHashed = crypto
      .createHmac('sha256', HASH_SECRET)
      .update(userName)
      .digest('hex');

    // cifer password
    const userPasswordEncrypted = encrypt(userNewPassword, ENC_KEY);

    let isSameNameUser;

    try {
      isSameNameUser = await this.usersRepository.findOne({ userNameHashed });
    } catch (error) {
      throw new HttpException('INTERNAL_SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const group = this.selectUserGroup(userNameHashed, isSameNameUser);

    //save to db
    try {
      const user = new User();
      user.id = userId;
      user.userNameHashed = userNameHashed;
      user.userPasswordEncrypted = userPasswordEncrypted;
      user.group = group;

      return this.usersRepository.save(user);
    } catch (error) {
        throw new HttpException('INTERNAL_SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updatePassword(createUserDataDto: CreateUserDataDto): Promise<User> {
    const { userId, userName, userOldPassword, userNewPassword } = createUserDataDto;

    //check user old password
    const oldPassword = userOldPassword;
    const currentUser = await this.usersRepository.findOne(userId);

    if (!currentUser) {
      throw new HttpException('No such user', HttpStatus.NOT_FOUND);
    }

    const decryptedPasword = decrypt(
      currentUser.userPasswordEncrypted,
      ENC_KEY,
    );

    if (oldPassword !== decryptedPasword) {
      console.log("PASSWORDS DIDN'T MATCH");
      throw new HttpException('Invalid old password!', HttpStatus.FORBIDDEN);
    }

    //if passwords match
    //hash username
    const userNameHashed = crypto
      .createHmac('sha256', HASH_SECRET)
      .update(userName)
      .digest('hex');

    const userPasswordEncrypted = encrypt(userNewPassword, ENC_KEY);
    let isSameNameUser;

    try {
      isSameNameUser = await this.usersRepository.findOne({ userNameHashed });
    } catch (error) {
      throw new HttpException('INTERNAL_SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const group = this.selectUserGroup(userNameHashed, isSameNameUser);

    currentUser.id = userId;
    currentUser.userNameHashed = userNameHashed;
    currentUser.userPasswordEncrypted = userPasswordEncrypted;
    currentUser.group = group;

    try {
      return this.usersRepository.save(currentUser);
    } catch (error) {
        throw new HttpException('INTERNAL_SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
