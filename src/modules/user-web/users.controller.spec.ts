import { Test , TestingModule} from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UserPersistenceAdapterService } from '../user-persistence/user.persistance-adapter.service';
import { CreateUserDataDto } from './dto/create-user-data.dto';
import { UserOrmEntity } from '../user-persistence/user.orm.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateUserUseCase, UpdateUserUseCaseSymbol } from '../../domains/ports/in/update-user.use-case';
import { mock } from 'ts-mockito';
import { UpdateUserCommand } from '../../domains/ports/in/update-user.command';
import { generateString } from '../utils/testing-helpers/generators.utils';
import { HttpException, HttpStatus } from '@nestjs/common';


describe('UsersController', () => {
  let usersController: UsersController;
  let userPersistenceAdapterService: UserPersistenceAdapterService;
  let userDomainService : UpdateUserUseCase;

  const mockValue = {};

  let passwordGenerated;

  passwordGenerated = generateString(64);

  const createUserDataDto = {
    "userName":"gdfgjuuyg978989sdhdsfdasdasdasdsudf",
    "userOldPassword": passwordGenerated,
    "userNewPassword": passwordGenerated,
    "signature": "ac46abebcd7c8255f61f82afe7e57aec"
  }

  const invalidCreateUserDataDto = {
    "userName": 34,
    "userOldPassword": passwordGenerated,
    "userNewPassword": passwordGenerated,
    "signature": "ac46abebcd7c8255f61f82afe7e57aec"
  }

  const updateUserDataDto = {
    "userName":"Joe",
    "userOldPassword":passwordGenerated,
    "userNewPassword":passwordGenerated,
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


  let createUserMock = jest.fn(createUserDataDto => createdUserExpectedResult);
  let updateUserMock = jest.fn(updateUserCommand => updatedUserExpectedResult);


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

    userPersistenceAdapterService = moduleRef.get<UserPersistenceAdapterService>(UserPersistenceAdapterService, );
    userDomainService = moduleRef.get<UpdateUserUseCase>(UpdateUserUseCaseSymbol);
    usersController = moduleRef.get<UsersController>(UsersController);

    passwordGenerated = generateString(64);

    createUserDataDto.userNewPassword = passwordGenerated;
    createUserDataDto.userOldPassword = passwordGenerated;
    createdUserExpectedResult.userPasswordEncrypted = passwordGenerated;
    updateUserDataDto.userOldPassword = passwordGenerated;
    updateUserDataDto.userNewPassword = passwordGenerated;
  });


  describe('create', () => {
    it('should be called with passed data once', async() => {
      await usersController.create(createUserDataDto);
      expect(createUserMock).toHaveBeenCalledTimes(1);
      expect(createUserMock).toHaveBeenCalledWith(createUserDataDto);
    });

    it('should return created user object', async() => {
      expect(await usersController.create(createUserDataDto)).toEqual(createdUserExpectedResult);
    });

   /* it('should throw validation error- fail', async () => {
      createUserMock = jest.fn(createUserDataDto => {throw new HttpException('Validation failed', HttpStatus.BAD_REQUEST)});
      await usersController.create(invalidCreateUserDataDto as unknown as CreateUserDataDto);
      expect(createUserMock).toThrowError(new Error('Validation failed'));
    }); */
  });



 
  describe('update', () => {
      it('should be called with passed data once', async () => {
        const updateUserCommand = new UpdateUserCommand(1,createUserDataDto);

        await usersController.update(1,createUserDataDto);
        expect(updateUserMock).toHaveBeenCalledTimes(1);
        expect(updateUserMock).toHaveBeenCalledWith(updateUserCommand);
      });

      it('should return updated user object', async () => {
       // const updateUserCommand = new UpdateUserCommand(1,updateUserDataDto);
        expect(await usersController.update(1,updateUserDataDto)).toEqual(updatedUserExpectedResult);
      });

      it('should throw an error if user with such id is not found', async() => {
        const updateUserCommand = new UpdateUserCommand(1,updateUserDataDto);
       // updateUserMock = jest.fn(updateUserCommand => {throw new HttpException('NO_SUCH_USER', HttpStatus.NOT_FOUND)});
          //updateUserMock.mockImplementation(() => {throw new HttpException('NO_SUCH_USER', HttpStatus.NOT_FOUND)})

          updateUserMock = jest.fn(updateUserCommand => {throw new HttpException('NO_SUCH_USER', HttpStatus.NOT_FOUND)});
       

          expect(await usersController.update(1,updateUserDataDto)).toBe('NO_SUCH_USER');
       });
  });
});

 