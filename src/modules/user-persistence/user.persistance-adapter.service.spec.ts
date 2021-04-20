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

  let nameHashedGenerated, userPasswordEncryptedGenerated,createdUserExpectedResult, domainUser;
  let passwordGenerated;

  class UserRepositoryFake {
    public async save(): Promise<void> {}
    public async findOne(): Promise<void> {}
  };

  
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserPersistenceAdapterService,
        { provide:  getRepositoryToken(UserOrmEntity), useClass: UserRepositoryFake },
        {
          provide: UpdateUserUseCaseSymbol,
          useValue: mockValue
        },
      ],
    }).compile();

    userPersistenceAdapterService = moduleRef.get<UserPersistenceAdapterService>(UserPersistenceAdapterService);
    userRepository = moduleRef.get(getRepositoryToken(UserOrmEntity));

    passwordGenerated = generateString(64);

    nameHashedGenerated = generateString(64);
    userPasswordEncryptedGenerated = generateString(64);
      
    (cipherUtils.hashToSha256 as jest.Mock).mockImplementation(() => nameHashedGenerated);
    (cipherUtils.encrypt as jest.Mock).mockImplementation(() => userPasswordEncryptedGenerated);

    createdUserExpectedResult = {
      "id": 1,
      "userNameHashed": nameHashedGenerated,
      "userPasswordEncrypted": userPasswordEncryptedGenerated,
      "group": null
    };

    domainUser = new UserEntity (
      '8ab93ab71fe07dc816c8650a8d3ad3f98bd5743957aa732816ad82955c9e2840',
      passwordGenerated,
      passwordGenerated,
      1,
      '5ab93ab71fe07dc816c8650a8d3ad3f98bd5743957aa732816ad82955c9e28403',
      passwordGenerated,
      passwordGenerated,
    );
  });


  describe('createUser', () => {
    it('should call the repository with correct paramaters and return created user object', async () => {
      const userDataToSave = {
        userNameHashed: createdUserExpectedResult.userNameHashed,
        userPasswordEncrypted: createdUserExpectedResult.userPasswordEncrypted,
        group: createdUserExpectedResult.group
      };

      const userRepositorySaveSpy = jest.spyOn(userRepository, 'save').mockResolvedValue(createdUserExpectedResult);

      const res = await userPersistenceAdapterService.createUser(createUserDataDto);

      expect(userRepositorySaveSpy).toHaveBeenCalledTimes(1);
      expect(userRepositorySaveSpy).toHaveBeenCalledWith(userDataToSave);
      expect(res).toEqual(createdUserExpectedResult);
    });


    it('should throw INTERNAL_SERVER_ERROR with status 500', async () => {
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
    it(`call the repository and mapUserByNametoDomain function with correct paramaters 
      and return UserEntity instance if findOne repository method returned found user`, async () => {
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
      const mapUserByNametoDomainSpy = jest.spyOn(UserMapper,'mapUserByNametoDomain').mockReturnValue(mappedToDomainEntityUser);

      const res = await userPersistenceAdapterService.loadUserByName(createUserDataDto.userName);
      
      expect(userRepositoryFindOneSpy).toHaveBeenCalledWith({
        userNameHashed: nameHashedGenerated,
      });
      expect(userRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
      expect(mapUserByNametoDomainSpy).toHaveBeenCalledWith(foundUser);
      expect(mapUserByNametoDomainSpy).toHaveBeenCalledTimes(1);
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


  describe('loadUserById ', () => {
    it('call the repository and mapUserByNametoDomain function with correct paramaters and return UserEntity instance', async () => {
      const currentUserDecryptedPasword = generateString(64);
      const userNewPasswordEncrypted = generateString(64);
      const userNewNameHashed = generateString(64);

      const foundUser = {
        "id": 1,
        "userNameHashed": nameHashedGenerated,
        "userPasswordEncrypted": userPasswordEncryptedGenerated,
        "group": null
      };

      const mappedToDomainEntityUser = new UserEntity(
        foundUser.userNameHashed,
        foundUser.userPasswordEncrypted,
        currentUserDecryptedPasword,
        foundUser.id,
        userNewNameHashed,
        createUserDataDto.userOldPassword,
        userNewPasswordEncrypted,
      );

      const userRepositoryFindOneSpy = jest.spyOn(userRepository, 'findOne').mockResolvedValue(foundUser);

      (cipherUtils.decrypt as jest.Mock).mockImplementation(() => currentUserDecryptedPasword);
      (cipherUtils.encrypt as jest.Mock).mockImplementation(() => userNewPasswordEncrypted);
      (cipherUtils.hashToSha256 as jest.Mock).mockImplementation(() => userNewNameHashed);
      
      const mapUserByIdtoDomainSpy = jest.spyOn(UserMapper,'mapUserByIdtoDomain').mockReturnValue(mappedToDomainEntityUser);
      const res = await userPersistenceAdapterService.loadUserById(1, createUserDataDto);

      expect(userRepositoryFindOneSpy).toHaveBeenCalledWith(
        foundUser.id,
      );
      expect(userRepositoryFindOneSpy).toHaveBeenCalledTimes(1);

      expect(mapUserByIdtoDomainSpy).toHaveBeenCalledWith(
        foundUser,
        createUserDataDto.userOldPassword,
        currentUserDecryptedPasword,
        userNewPasswordEncrypted,
        userNewNameHashed
      );
      expect(mapUserByIdtoDomainSpy).toHaveBeenCalledTimes(1);
      expect(res).toBeInstanceOf(UserEntity);
      expect(res).toEqual(mappedToDomainEntityUser);
    });


    it('should throw NOT_FOUND error with status 404 and "No such user" error message', async () => {
      jest.spyOn(userRepository, 'findOne').mockRejectedValue(new HttpException('No such user', HttpStatus.NOT_FOUND));

      try {
        await userPersistenceAdapterService.loadUserById(1, createUserDataDto);
      } catch(e) {
        expect(e.message).toBe('No such user');
        expect(e.status).toBe(404);
      }
    });
  });


  describe('updateUserState', () => {
    it('should call the repository with correct parameters and return updated user', async () => {
      const updatedUser = {
        "id": 1,
        "userNameHashed": nameHashedGenerated,
        "userPasswordEncrypted": userPasswordEncryptedGenerated,
        "group": 2
      };

      const mapToUserOrmEntitySpy = jest.spyOn(UserMapper,'mapToUserOrmEntity').mockReturnValue(updatedUser);
      const userRepositorySaveSpy = jest.spyOn(userRepository, 'save').mockResolvedValue(updatedUser);

      const res = await userPersistenceAdapterService.updateUserState(domainUser);

      expect(mapToUserOrmEntitySpy).toHaveBeenCalledWith(domainUser);
      expect(mapToUserOrmEntitySpy).toHaveBeenCalledTimes(1);
      expect(userRepositorySaveSpy).toHaveBeenCalledWith(updatedUser);
      expect(userRepositorySaveSpy).toHaveBeenCalledTimes(1);
      expect(res).toEqual(updatedUser);
    });

    it('should throw INTERNAL_SERVER_ERROR with status 500', async () => {
      jest.spyOn(userRepository, 'save').mockRejectedValue(new HttpException('INTERNAL_SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR));
  
      try {
        await userPersistenceAdapterService.updateUserState(domainUser);
      } catch(e) {
        expect(e.message).toBe('INTERNAL_SERVER_ERROR');
        expect(e.status).toBe(500);
      }
    });
  });
});
