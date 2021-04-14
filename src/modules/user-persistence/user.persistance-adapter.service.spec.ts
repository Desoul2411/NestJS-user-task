import { Test , TestingModule} from '@nestjs/testing';
import { UserPersistenceAdapterService } from './user.persistance-adapter.service';
import { CreateUserDataDto } from '../user-web/dto/create-user-data.dto';
import { UserOrmEntity } from './user.orm.entity';;
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateUserUseCaseSymbol } from '../../domains/ports/in/update-user.use-case';
import * as cipherUtils from '../utils/functions-helpers/cipher.utils';
import { generateString } from '../utils/testing-helpers/generators.utils';
import { Repository } from 'typeorm';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { UserMapper } from './user.mapper';
import { UserEntity } from '../../domains/entities/user.entity'


jest.mock('../utils/functions-helpers/cipher.utils', () => ({
  encrypt: jest.fn(),
  decrypt: jest.fn(),
  hashToSha256: jest.fn(),
}));

/* jest.mock('./user.mapper', () => ({
  encrypt: jest.fn(),
  decrypt: jest.fn(),
  hashToSha256: jest.fn(),
})); */

jest.mock('./user.mapper');


describe('UserPersistenceAdapterService', () => {
  let userPersistenceAdapterService: UserPersistenceAdapterService;
  let userRepository: Repository<UserOrmEntity>;

  const mockValue = {};

  const generatedPassword = generateString(64);

  const createUserDataDto = {
    "userName":"gdfgjuuyg978989sdhdsfdasdasdasdsudf",
    "userOldPassword": generatedPassword,
    "userNewPassword": generatedPassword,
    "signature": "ac46abebcd7c8255f61f82afe7e57aec"
  };

/*   const createUserMock = jest.fn();
  const loadUserByNameMock = jest.fn();
  const loadUserByIdMock = jest.fn();
  const updateUserStateMock = jest.fn();
 */
  let nameHashedGenerated, userPasswordEncryptedGenerated,createdUserExpectedResult;
  let userPasswordGenerated;

  const InvalidCreateUserDataDto = { 
    "userName":"",
    "userOldPassword":"veryStrongPassword",
    "userNewPassword":"veryStrongPassword",
    "signature": "82ef280c14ce9baa5e39a4b87bff7978"
  }

  class UserRepositoryFake {
    public async save(): Promise<void> {}
    public async findOne(): Promise<void> {}
   // public async remove(): Promise<void> {}
    
  }


  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserPersistenceAdapterService,
        {provide:  getRepositoryToken(UserOrmEntity), useClass: UserRepositoryFake },
        {
          provide: UpdateUserUseCaseSymbol,
          useValue: mockValue
        },
      ],
    }).compile();

    userPersistenceAdapterService = moduleRef.get<UserPersistenceAdapterService>(UserPersistenceAdapterService);
    userRepository = moduleRef.get(getRepositoryToken(UserOrmEntity));

    nameHashedGenerated = generateString(64);
    userPasswordEncryptedGenerated = generateString(64);

    userPasswordGenerated = generateString(64);
      
    (cipherUtils.hashToSha256 as jest.Mock).mockImplementation(() => nameHashedGenerated);
    (cipherUtils.encrypt as jest.Mock).mockImplementation(() => userPasswordEncryptedGenerated);

    createdUserExpectedResult = {
      "id": 1,
      "userNameHashed": nameHashedGenerated,
      "userPasswordEncrypted": userPasswordEncryptedGenerated,
      "group": null
    }
  });


  describe('createUser', () => {
    it('calls the repository with correct paramaters', async () => {
      const userDataToSave = {
        userNameHashed: createdUserExpectedResult.userNameHashed,
        userPasswordEncrypted: createdUserExpectedResult.userPasswordEncrypted,
        group: createdUserExpectedResult.group
      };

      const playlistRepositorySaveSpy = jest.spyOn(userRepository, 'save').mockResolvedValue(createdUserExpectedResult);

      await userPersistenceAdapterService.createUser(createUserDataDto);
      
      expect(playlistRepositorySaveSpy).toHaveBeenCalledTimes(1);
      expect(playlistRepositorySaveSpy).toHaveBeenCalledWith(userDataToSave);
    });


    it('should return created user object', async () => {
      jest.spyOn(userRepository, 'save').mockResolvedValue(createdUserExpectedResult);

      const res = await userPersistenceAdapterService.createUser(createUserDataDto);

      expect(res).toEqual(createdUserExpectedResult);
    });

    it('should throw INTERNAL_SERVER_ERROR', async () => {
      jest.spyOn(userRepository, 'save').mockRejectedValue(new HttpException('INTERNAL_SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR));

      try {
        await userPersistenceAdapterService.createUser(createUserDataDto);
      } catch(e) {
        expect(e.message).toBe('INTERNAL_SERVER_ERROR');
        expect(e.status).toBe(500);
      }
    });
  });


  describe('loadUserByName', () => {
    it('calls the repository with correct paramaters', async () => {
      const foundUser = {
        "id": 1,
        "userNameHashed": nameHashedGenerated,
        "userPasswordEncrypted": userPasswordEncryptedGenerated,
        "group": null
      };

      const mappedToDomainEntityUser = new UserEntity(
        null,
        null,
        null,
        null,
        foundUser.userNameHashed,
        null,
        null
    );

      const userRepositoryFindOneSpy = jest.spyOn(userRepository, 'findOne').mockResolvedValue(foundUser);
      jest.spyOn(UserMapper,'mapUserByNametoDomain').mockReturnValue(mappedToDomainEntityUser)

      const res = await userPersistenceAdapterService.loadUserByName(createUserDataDto.userName);
      
      expect(userRepositoryFindOneSpy).toHaveBeenCalledWith({
        userNameHashed: nameHashedGenerated,
      });
      expect(userRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
    });


    it('should return UserEntity instance if findOne repository method returned found user', async () => {
      const foundUser = {
        "id": 1,
        "userNameHashed": nameHashedGenerated,
        "userPasswordEncrypted": userPasswordEncryptedGenerated,
        "group": null
      };

      const mappedToDomainEntityUser = new UserEntity(
        null,
        null,
        null,
        null,
        foundUser.userNameHashed,
        null,
        null
    );

      const userRepositoryFindOneSpy = jest.spyOn(userRepository, 'findOne').mockResolvedValue(foundUser);
      jest.spyOn(UserMapper,'mapUserByNametoDomain').mockReturnValue(mappedToDomainEntityUser)

      const res = await userPersistenceAdapterService.loadUserByName(createUserDataDto.userName);
      
      expect(res).toEqual(mappedToDomainEntityUser);
    });


    it('should return UserEntity instance if findOne repository method returned undefined', async () => {
      const mappedToDomainEntityUser = new UserEntity(
        null,
        null,
        null,
        null,
        undefined,
        null,
        null
    );

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);
      jest.spyOn(UserMapper,'mapUserByNametoDomain').mockReturnValue(mappedToDomainEntityUser)

      const res = await userPersistenceAdapterService.loadUserByName(createUserDataDto.userName);

      expect(res).toBeInstanceOf(UserEntity);
      expect(res).toEqual(mappedToDomainEntityUser);
    });
  });


  describe('loadUserById - success', () => {
    

  });

  describe('loadUserById - fail', () => {

  });

  describe('updateUserState - success', () => {

  });

  describe('updateUserState - fail', () => {

  });


});







/* import { Test , TestingModule} from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersDataService } from './users.service';
import { CreateUserDataDto } from './dto/create-user-data.dto';
import { User } from './user.orm.entity';;
import { getRepositoryToken } from '@nestjs/typeorm';
import * as mathUtils from '../utils/functions-helpers/math.utils';


jest.mock('../utils/functions-helpers/math.utils', () => ({
  
  factorial: jest.fn(),
  fib: jest.fn()
}));



describe('UsersService', () => {
  let usersController: UsersController;
  let usersDataService: UsersDataService;
  let createUserDataDto : CreateUserDataDto;

  const mockValue = {};

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
        controllers: [UsersController],
        providers: [
          UsersDataService
        ,{
          provide: getRepositoryToken(User),
          useValue: mockValue,
        }],
      }).compile();

    usersDataService = moduleRef.get<UsersDataService>(UsersDataService);
    usersController = moduleRef.get<UsersController>(UsersController);
    createUserDataDto = new CreateUserDataDto;
  });

  describe('selectUserGroup', () => {
    it('should return 1 ', () => {

      (mathUtils.factorial as jest.Mock).mockImplementation(() => 3);
      (mathUtils.fib as jest.Mock).mockImplementation(() => 1);

      expect(usersDataService.selectUserGroup('John',0)).toBe(1);
    });

    it('should return 2 ', () => {

      (mathUtils.factorial as jest.Mock).mockImplementation(() => 3);
      (mathUtils.fib as jest.Mock).mockImplementation(() => 2);

      expect(usersDataService.selectUserGroup('John',0)).toBe(2);
    });

    it('should return 3', () => {

      (mathUtils.factorial as jest.Mock).mockImplementation(() => 3);
      (mathUtils.fib as jest.Mock).mockImplementation(() => 2);

      expect(usersDataService.selectUserGroup(undefined,0)).toBe(3);
    });
  });

});
 */



/* import connection from '../connection';

beforeAll(async ()=>{
  await connection.create();
});

afterAll(async ()=>{
  await connection.close();
});

beforeEach(async () => {
  await connection.clear();
});

 */
/* import { Connection, Repository } from 'typeorm'
import { createMemDB } from '../utils/testing-helpers/createMemDB'
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersDataService } from './users.service';
import { CreateUserDataDto } from './dto/create-user-data.dto';
import { Request, Response } from 'express';


describe('User Service', () => {
  let db: Connection
  let createUserDataDto : CreateUserDataDto
  let userDataService: UsersDataService
  let userRepository: Repository<User>
  let req : Request
  let res : Response

  beforeAll(async () => {
    db = await createMemDB([User])
    userRepository = await db.getRepository(User)
    userDataService = new UsersDataService(userRepository) // <--- manually inject
    createUserDataDto = new CreateUserDataDto
  })
  afterAll(() => db.close())

  it('should create a new user', async () => {
    const createUserDataDto = {
        "userId": 56546,
        "userName":"sddasdasd",
        "userOldPassword":"veryStrongPasswor",
        "userNewPassword":"veryStrongPassword",
        "signature": "ec6abedc36462467d9e5817307e6d602"
      }

    const newUser = await userDataService.create(createUserDataDto,req,res)
    expect(newUser.id).toBeDefined()
  })
}) */
