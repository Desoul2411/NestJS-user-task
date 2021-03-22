import { Test , TestingModule} from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersDataService } from './users.service';
import { User } from './user.entity';
import { createConnection, getConnection, getRepository, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersDataService: UsersDataService;
  let userRepository: Repository<User>;

  const testConnectionName = 'testConnection';

  const mockValue = {}

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
    
  });


  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [
        {
          "id": 255,
          "userNameHashed": "9c2d29850e7fd884c19b3ef48a01b82c0a88854082ad150056ac770dcbeee05c",
          "userPasswordEncrypted": "m5biIADc/0jKc2oq8YXJOmRs9Dmw+71KPy+ghSDdoFY=",
          "group": 2
        }
      ];
      
      jest.spyOn(usersDataService, 'findAll').mockImplementation(async () => result);

      expect(await usersController.findAll()).toBe(result);
    });
  });
});

 