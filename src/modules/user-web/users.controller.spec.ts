/* import { Test , TestingModule} from '@nestjs/testing';
import { UsersController } from '../user-persistence/users.controller';
import { UsersDataService } from '../user-persistence/users.service';
import { CreateUserDataDto } from './dto/create-user-data.dto';
import { UserOrmEntity } from '../user-persistence/user.orm.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersDataService: UsersDataService;
  let createUserDataDto : CreateUserDataDto

  const mockValue = {};

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
        controllers: [UsersController],
        providers: [
          UsersDataService
        ,{
          provide: getRepositoryToken(UserOrmEntity),
          useValue: mockValue,
        }],
      }).compile();

    usersDataService = moduleRef.get<UsersDataService>(UsersDataService);
    usersController = moduleRef.get<UsersController>(UsersController);
    createUserDataDto = new CreateUserDataDto;
    
  });

  describe('findAll', () => {
    it('should be a function and exist in UsersController', () => {
      expect(typeof usersController.findAll).toBe('function');
    })

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


  describe('create', () => {
    it('should be a function and exist in UsersController', () => {
      expect(typeof usersController.create).toBe('function');
    })

    it('should return created user object', async () => {

      const result = 
        {
          "id": 255,
          "userNameHashed": "9c2d29850e7fd884c19b3ef48a01b82c0a88854082ad150056ac770dcbeee05c",
          "userPasswordEncrypted": "m5biIADc/0jKc2oq8YXJOmRs9Dmw+71KPy+ghSDdoFY=",
          "group": 2
        }
      
      jest.spyOn(usersDataService, 'create').mockImplementation(async () => result);

      expect(await usersController.create(createUserDataDto)).toBe(result);
    });
  });

 */
  /* describe('update', () => {
    it('should be a function and exist in UsersController', () => {
      expect(typeof usersController.create).toBe('function');
    })

    it('should return updated user object', async () => {

      const result = 
        {
          "id": 255,
          "userNameHashed": "9c2d29850e7fd884c19b3ef48a01b82c0a88854082ad150056ac770dcbeee05c",
          "userPasswordEncrypted": "m5biIADc/0jKc2oq8YXJOmRs9Dmw+71KPy+ghSDdoFY=",
          "group": 2
        }
      
      jest.spyOn(usersDataService, 'update').mockImplementation(async () => result);

      expect(await usersController.update(createUserDataDto)).toBe(result);
    });
  }); */
//});

 