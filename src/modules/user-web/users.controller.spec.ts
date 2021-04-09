import { Test , TestingModule} from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UserPersistenceAdapterService } from '../user-persistence/user.persistance-adapter.service';
import { CreateUserDataDto } from './dto/create-user-data.dto';
import { UserOrmEntity } from '../user-persistence/user.orm.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateUserUseCase, UpdateUserUseCaseSymbol } from '../../domains/ports/in/update-user.use-case';
import { mock } from 'ts-mockito';


describe('UsersController', () => {
  let usersController: UsersController;
  let userPersistenceAdapterService: UserPersistenceAdapterService;
  let createUserDataDto : CreateUserDataDto
  
  let userDomainService : UpdateUserUseCase;

  const mockValue = {};

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
        controllers: [UsersController],
        providers: [
          UserPersistenceAdapterService,
        {
          provide: getRepositoryToken(UserOrmEntity),
          useValue: mockValue,
        },

      /*   userDomainService, {
          provide: getRepositoryToken(UpdateUserUseCaseSymbol),
          useValue: mockValue
        } */
      ],
      }).compile();

    userPersistenceAdapterService = moduleRef.get<UserPersistenceAdapterService>(UserPersistenceAdapterService, );
    userDomainService = moduleRef.get<UpdateUserUseCase>(UpdateUserUseCaseSymbol);
    usersController = moduleRef.get<UsersController>(UsersController);
    createUserDataDto = new CreateUserDataDto;



    //const UpdateUserUseCase = 
    
  });


  describe('create', () => {
    it('should be a function and exist in UsersController', () => {
      expect(typeof usersController.create).toBe('function');
    })

    it('should return created user object', async() => {

      const result = 
        {
          "id": 255,
          "userNameHashed": "9c2d29850e7fd884c19b3ef48a01b82c0a88854082ad150056ac770dcbeee05c",
          "userPasswordEncrypted": "m5biIADc/0jKc2oq8YXJOmRs9Dmw+71KPy+ghSDdoFY=",
          "group": 2
        }
      
      jest.spyOn(userPersistenceAdapterService, 'createUser').mockImplementation(async () => result);

      expect(await usersController.create(createUserDataDto)).toBe(result);
    });
  });

 
/*   describe('update', () => {
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
});

 