import { Test , TestingModule} from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UserPersistenceAdapterService } from '../user-persistence/user.persistance-adapter.service';
import { CreateUserDataDto } from './dto/create-user-data.dto';
import { UserOrmEntity } from '../user-persistence/user.orm.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateUserUseCase, UpdateUserUseCaseSymbol } from '../../domains/ports/in/update-user.use-case';
import { mock } from 'ts-mockito';
import { UpdateUserCommand } from '../../domains/ports/in/update-user.command';


describe('UsersController', () => {
  let usersController: UsersController;
  let userPersistenceAdapterService: UserPersistenceAdapterService;
  let userDomainService : UpdateUserUseCase;

  const mockValue = {};

  const createUserDataDto = {
    "userName":"gdfgjuuyg978989sdhdsfdasdasdasdsudf",
    "userOldPassword":"veryStrongPassword",
    "userNewPassword":"veryStrongPassword",
    "signature": "ac46abebcd7c8255f61f82afe7e57aec"
  }

  const expectedResult = {
    "id": 14,
    "userNameHashed": "b8ea7132aeb096a3cdc8cd453075f8bd53ead6120baf545299e4949aeb9ff5ba",
    "userPasswordEncrypted": "aUhWM2dRMC9XY2E1R1ZianJ3WTBNZVpNaHNMWmM4L3RzTWdkYWw1NjBJVT0tLW5kb2hrbERTcHRQOUlnZWs1dVdRMWc9PQ==",
    "group": 2
  }


  const createUserMock = jest.fn(createUserDataDto => expectedResult);
  const updateUserMock = jest.fn();


  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
        providers: [
          UsersController,
          UserPersistenceAdapterService,
        {
          provide: getRepositoryToken(UserOrmEntity),
          useValue: mockValue,
        },
        {
          provide: UpdateUserUseCaseSymbol,
          useValue: {
            updateUser: updateUserMock,
          }
        },
        {
          provide: UserPersistenceAdapterService,
          useValue: {
            createUser: createUserMock,
            updateUser: updateUserMock,
          }
        }
      ],
      }).compile();

    userPersistenceAdapterService = moduleRef.get<UserPersistenceAdapterService>(UserPersistenceAdapterService, );
    userDomainService = moduleRef.get<UpdateUserUseCase>(UpdateUserUseCaseSymbol);
    usersController = moduleRef.get<UsersController>(UsersController);
  });


  describe('create', () => {
    it('should be called with passed data once', async() => {
      await usersController.create(createUserDataDto);
      expect(createUserMock).toHaveBeenCalledTimes(1);
      expect(createUserMock).toHaveBeenCalledWith(createUserDataDto);
    });

    it('should return created user object', async() => {
      await usersController.create(createUserDataDto);
      expect(createUserMock).toHaveReturnedWith(expectedResult);
    });
  });



 
  describe('update', () => {
      it('should return updated user object', async () => {
        const updateUserCommand = new UpdateUserCommand(1,createUserDataDto);

        await usersController.update(1,createUserDataDto);
        expect(updateUserMock).toHaveBeenCalledTimes(1)
        expect(updateUserMock).toHaveBeenCalledWith(updateUserCommand);
      });
  });
});

 