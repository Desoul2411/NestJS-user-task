import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserOrmEntity } from "./user.orm.entity";
import { UserEntity, UserId } from '../../domains/entities/user.entity';
import { encrypt, hashToSha256 } from "../utils/functions-helpers/cipher.utils";
import { CreateUserDataDto } from "./dto/create-user-data.dto";
import { UserMapper } from './user.mapper';

require('dotenv').config();
const crypto = require('crypto');
const ENC_KEY = process.env.ENC_KEY;
const HASH_SECRET = process.env.HASH_SECRET;



@Injectable()
export class UserPersistenceAdapterService {   // must implement port from ports/out/..
	constructor(
		@InjectRepository(UserOrmEntity)
		private _userRepository: Repository<UserOrmEntity>,
	) {}

    async createUser(createUserDataDto: CreateUserDataDto): Promise<UserEntity> {
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

            /*  return this._userRepository.save(user); */
            //map user to domain
            return UserMapper.mapToDomain(user);
        } catch (error) {
            throw new HttpException('INTERNAL_SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}