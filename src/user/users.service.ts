import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDataDto } from './dto/create-user-data.dto';

const crypto = require('crypto');




const ENC_KEY = "bf3c199c2470cb477d907b1e0917c17b"; // set random encryption key
const IV = "5183666c72eec9e4"; 

const encrypt = ((password: string /* ENC_KEY: string, IV: string  */) : string => {
    //const ENC_KEY = crypto.randomBytes(32);
    //const IV = crypto.randomBytes(16); 
    
    let cipher = crypto.createCipheriv('aes-256-cbc', ENC_KEY, IV);
    let encrypted = cipher.update(password, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
});


const decrypt = ((encryptedPassword: string) : string => {
    let decipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, IV);
    let decrypted = decipher.update(encryptedPassword, 'base64', 'utf8');
    return (decrypted + decipher.final('utf8'));
});




@Injectable()
export class UsersDataService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        //private connection: Connection
    ){}


    async findAll(): Promise<User[]>{
        return this.usersRepository.find();
    }



    create(createUserDataDto: CreateUserDataDto): Promise<User> {
        const password = createUserDataDto.userNewPassword;
        const userName = createUserDataDto.userName;

        //hash username
        let hashedUserName = crypto
        .createHash('sha256')
        .update(userName)
        .digest('hex');

        console.log('hashedUserName', hashedUserName);

        // cifer password
        
        let encrypted_key = encrypt(password /* ENC_KEY, IV */);
        let decrypted_key = decrypt(encrypted_key /* ENC_KEY, IV */);
        console.log('encrypted_key ', encrypted_key );
        console.log('decrypted_key ', decrypted_key  );


        const user = new User();
        user.userId = createUserDataDto.userId;
        user.userName = createUserDataDto.userName;
        user.userOldPassword = createUserDataDto.userOldPassword,
        user.userNewPassword = createUserDataDto.userNewPassword,
        user.signature = createUserDataDto.signature;

        
    
        return this.usersRepository.save(user);
    }
}


