import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserOrmEntity } from "./user.orm.entity";
import { UserEntity, UserId } from '../../domains/entities/user.entity';
import { encrypt, decrypt, hashToSha256 } from "../utils/functions-helpers/cipher.utils";
import { CreateUserDataDto } from "../user-web/dto/create-user-data.dto";
import { UserMapper } from './user.mapper';
import { CreateUserPort } from "src/domains/ports/out/create-user.port";
import { UpdateUserStatePort } from "src/domains/ports/out/update-user-port"; 
import { factorial, fib } from "../utils/functions-helpers/math.utils";
import { LoadUserPort } from "src/domains/ports/out/load-user.port";

require('dotenv').config();
const crypto = require('crypto');
const ENC_KEY = process.env.ENC_KEY;
const HASH_SECRET = process.env.HASH_SECRET;



@Injectable()
export class UserPersistenceAdapterService implements LoadUserPort {   // must implement port from ports/out/..
	constructor(
		@InjectRepository(UserOrmEntity)
		private _userRepository: Repository<UserOrmEntity>,
	) {}

/*     selectUserGroup = (
        isSameNameUser: string | undefined,
        currentUserId: number
      ): number => {
        const checkNumber = Math.abs(factorial(currentUserId) - fib(currentUserId));
        console.log('checkNumber', checkNumber);
        let group;
    
        if (checkNumber % 2 === 0) {
          group = 1;
        } else {
          group = isSameNameUser ? 2 : 3;
        }
    
        return group;
    }; */



    async createUser(createUserDataDto: CreateUserDataDto): Promise<UserOrmEntity> {
        const { userName, userNewPassword } = createUserDataDto;

        //hash username
        const userNameHashed = hashToSha256(userName, HASH_SECRET);

        // cipher password
        const userPasswordEncrypted = encrypt(userNewPassword, ENC_KEY);

        try {
            const user = new UserOrmEntity();
            user.userNameHashed = userNameHashed;
            user.userPasswordEncrypted = userPasswordEncrypted;
            user.group = null;

            return this._userRepository.save(user);

            //map user to domain
            //return UserMapper.mapToDomain(user);
        } catch (error) {
            throw new HttpException('INTERNAL_SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    async loadUser(userId: UserId, createUserDataDto: CreateUserDataDto): Promise<UserEntity> {
        const { userName, userOldPassword, userNewPassword } = createUserDataDto;
    
        const currentUser = await this._userRepository.findOne(userId);
    
        if (!currentUser) {
          throw new HttpException('No such user', HttpStatus.NOT_FOUND);
        }
    
        const currentUserDecryptedPasword = decrypt(currentUser.userPasswordEncrypted,ENC_KEY);
    
/*         if (userOldPassword !== currentUserDecryptedPasword) {
          console.log("PASSWORDS DIDN'T MATCH");
          throw new HttpException('Invalid old password!', HttpStatus.FORBIDDEN);
        } */

        
    
        const userNameHashed = hashToSha256(userName, HASH_SECRET);
    
        const userPasswordEncrypted = encrypt(userNewPassword, ENC_KEY);

        let isSameNameUser;
    
        try {
          isSameNameUser = await this._userRepository.findOne({ userNameHashed });
        } catch (error) {
          throw new HttpException('INTERNAL_SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return UserMapper.mapToDomain(currentUser, currentUserDecryptedPasword, userId,userNameHashed, userOldPassword, userPasswordEncrypted, isSameNameUser);
    
        /* const group = this.selectUserGroup(isSameNameUser, userId);
    
        currentUser.userNameHashed = userNameHashed;
        currentUser.userPasswordEncrypted = userPasswordEncrypted;
        currentUser.group = group; */
    
      /*   try {
          await this._userRepository.save(currentUser);
          return UserMapper.mapToDomain(currentUser);
        } catch (error) {
            throw new HttpException('INTERNAL_SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
        } */
    }

    async updateUserState(user: UserEntity) {
       try {
        await this._userRepository.save(UserMapper.mapToUserOrmEntity(user));
      } catch (error) {
          throw new HttpException('INTERNAL_SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
}