import { Test , TestingModule} from '@nestjs/testing';
import { UsersController } from '../user-web/users.controller';
import { UserPersistenceAdapterService } from './user.persistance-adapter.service';
import { CreateUserDataDto } from '../user-web/dto/create-user-data.dto';
import { UserOrmEntity } from './user.orm.entity';;
import { getRepositoryToken } from '@nestjs/typeorm';






describe('UserPersistenceAdapterService', () => {
  let usersController: UsersController;
  let usersDataService: UserPersistenceAdapterService;
  let createUserDataDto : CreateUserDataDto;

  const mockValue = {};


/*   const invalidTypesDTO = {   // how to test invalid dto?
    "userName": 22,
    "userOldPassword":"veryStrongPassword",
    "userNewPassword":"veryStrongPassword",
    "signature": "82ef280c14ce9baa5e39a4b87bff7978"
  }
 */

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
        controllers: [UsersController],
        providers: [
          UserPersistenceAdapterService
        ,{
          provide: getRepositoryToken(UserOrmEntity),
          useValue: mockValue,
        }],
      }).compile();

    usersDataService = moduleRef.get<UserPersistenceAdapterService>(UserPersistenceAdapterService);
    usersController = moduleRef.get<UsersController>(UsersController);
    createUserDataDto = new CreateUserDataDto;
  });

  describe('createUser', () => {
    it('should return created user', async () => {
      const result = {
            "id": 255,
            "userNameHashed": "9c2d29850e7fd884c19b3ef48a01b82c0a88854082ad150056ac770dcbeee05c",
            "userPasswordEncrypted": "m5biIADc/0jKc2oq8YXJOmRs9Dmw+71KPy+ghSDdoFY=",
            "group": 2
        };

      jest.spyOn(usersDataService, 'createUser').mockImplementation(async () => result);

      expect(await usersDataService.createUser(createUserDataDto)).toEqual(result);

    });

  });

  describe('createUser - fail', () => {


  });

  describe('loadUserByName - success', () => {


  });

  describe('loadUserByName - fail', () => {


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