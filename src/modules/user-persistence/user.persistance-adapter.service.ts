import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserOrmEntity } from "./user.orm.entity";
import { UserEntity, UserId } from '../../domains/entities/user.entity';
import { encrypt, decrypt, hashToSha256 } from "../utils/functions-helpers/cipher.utils";
import { CreateUserDataDto } from "../user-web/dto/create-user-data.dto";
import { UserMapper } from './user.mapper';
/* import { CreateUserPort } from "src/domains/ports/out/create-user.port"; */
import { UpdateUserStatePort } from "src/domains/ports/out/update-user-port"; 
import { LoadUserByIdPort } from "src/domains/ports/out/load-user-by-id.port";
import { LoadUserByNamePort } from "src/domains/ports/out/load-user-by-name.port";

require('dotenv').config();
const crypto = require('crypto');
const ENC_KEY = process.env.ENC_KEY;
const HASH_SECRET = process.env.HASH_SECRET;



@Injectable()
export class UserPersistenceAdapterService implements LoadUserByIdPort, LoadUserByNamePort  {   // must implement port from ports/out/..
	constructor(
		@InjectRepository(UserOrmEntity)
		private _userRepository: Repository<UserOrmEntity>,
	) {}

    async createUser(createUserDataDto: CreateUserDataDto): Promise<UserOrmEntity> {
        const { userName, userNewPassword } = createUserDataDto;

        //hash username
        const userNameHashed = hashToSha256(userName, HASH_SECRET);

        // cipher password
        const userPasswordEncrypted = encrypt(userNewPassword, ENC_KEY);

        try {
            return this._userRepository.save({userNameHashed, userPasswordEncrypted, group: null});
        } catch (error) {
            throw new HttpException('INTERNAL_SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    async loadUserByName(userName: string): Promise<UserEntity> {
        const userNameHashed = hashToSha256(userName, HASH_SECRET);
        const userByName = await this._userRepository.findOne({ userNameHashed });

        return UserMapper.mapUserByNametoDomain(userByName);
    } 


    async loadUserById(userId: UserId, createUserDataDto: CreateUserDataDto): Promise<UserEntity> {  // old user from db
      const { userName, userOldPassword, userNewPassword } = createUserDataDto;
      const currentUser = await this._userRepository.findOne(userId);

      if (!currentUser) {
        throw new HttpException('No such user', HttpStatus.NOT_FOUND);
      }

      const currentUserDecryptedPasword = decrypt(currentUser.userPasswordEncrypted,ENC_KEY);
      const userNewPasswordEncrypted = encrypt(userNewPassword, ENC_KEY);
      const userNewNameHashed = hashToSha256(userName, HASH_SECRET);

      return UserMapper.mapUserByIdtoDomain(currentUser, userOldPassword, currentUserDecryptedPasword, userNewPasswordEncrypted, userNewNameHashed);
    }
    

    async updateUserState(user: UserEntity) {
       try {
        return await this._userRepository.save(UserMapper.mapToUserOrmEntity(user));
      } catch (error) {
          throw new HttpException('INTERNAL_SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
}