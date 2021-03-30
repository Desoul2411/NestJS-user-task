import { Test , TestingModule} from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersDataService } from './users.service';
import { CreateUserDataDto } from './dto/create-user-data.dto';
import { User } from './user.entity';
//import { createConnection, getConnection, getRepository, Repository } from 'typeorm';
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
    it('should return 1 if', () => {

      (mathUtils.factorial as jest.Mock).mockImplementation(() => 3);
      (mathUtils.fib as jest.Mock).mockImplementation(() => 1);

      expect(usersDataService.selectUserGroup('John',0)).toBe(1);
    });
  });

});

 


























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
