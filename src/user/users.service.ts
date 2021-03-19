import { HttpStatus, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDataDto } from './dto/create-user-data.dto';

require('dotenv').config();
const crypto = require('crypto');


//const ENC_KEY = "bf3c199c2470cb477d907b1e0917c17b"; // set encryption key key
//const IV = "5183666c72eec9e4"; 
const ENC_KEY = process.env.ENC_KEY;
const HASH_SECRET = process.env.HASH_SECRET;

const encrypt = ((password: string) : string => {
    const IV = crypto.randomBytes(16).toString(); 
    //console.log('IV',IV);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENC_KEY, IV);
    let encrypted = cipher.update(password, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    return encrypted;
    //return Buffer.from(`${encrypted}--${IV}`, 'base64').toString();
})

const decrypt = ((encryptedPassword: string) : any => {
    const utf8Pass = Buffer.from(encryptedPassword, 'base64').toString('utf-8');
    console.log('utf8Pass' , utf8Pass);
     //password--iv
   /*  const decipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, IV);
    const decrypted = decipher.update(encryptedPassword, 'base64', 'utf8');
    return (decrypted + decipher.final('utf8')); */
})


@Injectable()
export class UsersDataService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ){}


    async findAll(): Promise<User[]>{
        return this.usersRepository.find();
    }
    
    async create(createUserDataDto: CreateUserDataDto): Promise<User>  /* Promise<User> */ {
        const { userId, userName, userOldPassword, userNewPassword } = createUserDataDto;

        //check user old password
            /* const oldPassword = userOldPassword;

            const currentUser = await this.usersRepository.findOne(userId);
            if(!currentUser) {
                throw new HttpException('No such user', HttpStatus.NOT_FOUND);
            }
            console.log('currentUser', currentUser);
            console.log('currentUser.userPasswordEncrypted', currentUser.userPasswordEncrypted); */



           /*  const decryptedPasword = decrypt(currentUser.userPasswordEncrypted);
            console.log('decryptedPasword',decryptedPasword);
            if (oldPassword !== decryptedPasword) {
                console.log("222");
                throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
            }
      */
        
        //console.log(response);

        //hash username
        let userNameHashed = crypto
        .createHmac('sha256', HASH_SECRET)
        .update(userName)
        .digest('hex');

        console.log('hashedUserName', userNameHashed);

        // cifer password
        const userPasswordEncrypted = encrypt(userNewPassword /* ENC_KEY, IV */);
         //const decrypted_password= decrypt(userPasswordEncrypted /* ENC_KEY, IV */);
         decrypt(userPasswordEncrypted /* ENC_KEY, IV */);
        console.log(userPasswordEncrypted);


        function factorial(n : number) : number {
            return (n != 1) ? n * factorial(n - 1) : 1;
        }

        function fib(n : number) : number {
            let a = 1;
            let b = 1;

            for (let i = 3; i <= n; i++) {
              let c = a + b;
              a = b;
              b = c;
            }

            return b;
        }

        let checkNumber = Math.abs(factorial(10) - fib(10));

        // select user group
        let group;

        if (checkNumber % 2 === 0) {
            group = 1;
        } else {
            try {
                group = 1;
                let isSameUser = await this.usersRepository.findOne({userNameHashed});
                group = isSameUser ? 2 : 3;
            } catch (error) {
                console.log(error);
            }
        }

        //save to db
        try {
            console.log('save user');
            const user = new User();
            user.id = userId;
            user.userNameHashed = userNameHashed;
            user.userPasswordEncrypted = userPasswordEncrypted;
            user.group = group;
            console.log('user saved');
            console.log('user', user);
            return this.usersRepository.save(user);
             
        } catch (error) {   
            console.log(error);
        }
        
    }
}


