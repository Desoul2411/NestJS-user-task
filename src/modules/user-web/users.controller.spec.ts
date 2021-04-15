import { Test , TestingModule} from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UserPersistenceAdapterService } from '../user-persistence/user.persistance-adapter.service';
//import { CreateUserDataDto } from './dto/create-user-data.dto';
import { UserOrmEntity } from '../user-persistence/user.orm.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateUserUseCase, UpdateUserUseCaseSymbol } from '../../domains/ports/in/update-user.use-case';
import { UpdateUserCommand } from '../../domains/ports/in/update-user.command';
import { generateString } from '../utils/testing-helpers/generators.utils';
import { HttpException, HttpStatus } from '@nestjs/common';


describe('UsersController', () => {
  let usersController: UsersController;
  let userPersistenceAdapterService: UserPersistenceAdapterService;
  let userDomainService : UpdateUserUseCase;

  let createUserMock = jest.fn();
  let updateUserMock = jest.fn();

  let passwordGenerated = generateString(64);
  const mockValue = {};
  
  const createUserDataDto = {
    "userName":"gdfgjuuyg978989sdhdsfdasdasdasdsudf",
    "userOldPassword": passwordGenerated,
    "userNewPassword": passwordGenerated,
    "signature": "ac46abebcd7c8255f61f82afe7e57aec"
  }

  const createdUserExpectedResult = {
    "id": 1,
    "userNameHashed": "b8ea7132aeb096a3cdc8cd453075f8bd53ead6120baf545299e4949aeb9ff5ba",
    "userPasswordEncrypted": passwordGenerated,
    "group": null
  }

  const updatedUserExpectedResult = {
    "id": 1,
    "userNameHashed": "b8ea7132aeb096a3cdc8cd453075f8bd53ead6120baf545299e4949aeb9ff5bc",
    "userPasswordEncrypted": passwordGenerated,
    "group": 1
  }


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
          }
        }
      ],
    }).compile();

    userPersistenceAdapterService = moduleRef.get<UserPersistenceAdapterService>(UserPersistenceAdapterService);
    userDomainService = moduleRef.get<UpdateUserUseCase>(UpdateUserUseCaseSymbol);
    usersController = moduleRef.get<UsersController>(UsersController);

    passwordGenerated = generateString(64);

    createUserDataDto.userNewPassword = passwordGenerated;
    createUserDataDto.userOldPassword = passwordGenerated;
    createdUserExpectedResult.userPasswordEncrypted = passwordGenerated;
  });

  describe('create', () => {
    it('should be called with passed data once', async() => {
      await usersController.create(createUserDataDto);
      expect(createUserMock).toHaveBeenCalledTimes(1);
      expect(createUserMock).toHaveBeenCalledWith(createUserDataDto);
    });

    it('should return created user object', async() => {
      createUserMock.mockResolvedValue(createdUserExpectedResult);
      expect(await usersController.create(createUserDataDto)).toEqual(createdUserExpectedResult);
    });
  });

 
  describe('update', () => {
    it('should be called with passed data once - success', async () => {
      const updateUserCommand = new UpdateUserCommand(1,createUserDataDto);

      await usersController.update(1,createUserDataDto);
      expect(updateUserMock).toHaveBeenCalledTimes(1);
      expect(updateUserMock).toHaveBeenCalledWith(updateUserCommand);
    });

    it('should return updated user object - success', async () => {
      updateUserMock.mockResolvedValue(updatedUserExpectedResult);
      expect(await usersController.update(1,createUserDataDto)).toEqual(updatedUserExpectedResult);
    });

    it('should throw an error with status 404 and message "No such user" - fail', async() => {
      updateUserMock.mockRejectedValue(new HttpException('No such user', HttpStatus.NOT_FOUND));

      try {
        await usersController.update(25,createUserDataDto);
      } catch(e) {
        expect(e.message).toBe('No such user');
        expect(e.status).toBe(404);
      }
    });

    it('should throw an error with status 403 and message "Invalid old password!" - fail', async() => {
      updateUserMock.mockRejectedValue(new HttpException('Invalid old password!', HttpStatus.FORBIDDEN));

      try {
        await usersController.update(1,createUserDataDto);
      } catch(e) {
        expect(e.message).toBe('Invalid old password!');
        expect(e.status).toBe(403);
      }
    });
  });
});

 