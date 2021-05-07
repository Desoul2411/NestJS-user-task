import { UserEntity } from '../entities/user.entity';
import { UpdateUserCommand } from '../ports/in/update-user.command';
import { UpdateUserService } from './update-user.service';
import { generateString } from '../../modules/utils/testing-helpers/generators.utils';

describe('UpdateUserService', () => {
  const loadUserByIdPortMock = {
    loadUserById: jest.fn(),
  };

  const loadUserByNamePort = {
    loadUserByName: jest.fn(),
  };

  const updateUserStatePort = {
    updateUserState: jest.fn(),
  };

  const updateUserServce = new UpdateUserService(
    loadUserByIdPortMock,
    loadUserByNamePort,
    updateUserStatePort,
  );

  let createUserDataDto, userById, userByName, updatedUser;

  beforeEach(async () => {
    const passwordGenerated = generateString(64);

    createUserDataDto = {
      userName: 'gdfgjuuyg978989sdhdsfdasdasdasdsudf',
      userOldPassword: passwordGenerated,
      userNewPassword: passwordGenerated,
      signature: 'ac46abebcd7c8255f61f82afe7e57aec',
    };

    userById = new UserEntity(
      '8ab93ab71fe07dc816c8650a8d3ad3f98bd5743957aa732816ad82955c9e2840',
      passwordGenerated,
      passwordGenerated,
      1,
      '5ab93ab71fe07dc816c8650a8d3ad3f98bd5743957aa732816ad82955c9e28403',
      passwordGenerated,
      passwordGenerated,
    );

    userByName = new UserEntity(
      null,
      null,
      null,
      null,
      '8ab93ab71fe07dc816c8650a8d3ad3f98bd5743957aa732816ad82955c9e2840',
      null,
      null,
    );

    updatedUser = {
      id: 1,
      userNameHashed:
        '8ab93ab71fe07dc816c8650a8d3ad3f98bd5743957aa732816ad82955c9e2840',
      userPasswordEncrypted: passwordGenerated,
      group: 2,
    };
  });

  describe('updateUser', () => {
    it('should call internal functions with correct parameters and return updated user', async () => {
      const command = new UpdateUserCommand(1, createUserDataDto);

      const loadUserByIdOneSpy = jest
        .spyOn(loadUserByIdPortMock, 'loadUserById')
        .mockResolvedValue(userById);
      const loadUserByNameSpy = jest
        .spyOn(loadUserByNamePort, 'loadUserByName')
        .mockResolvedValue(userByName);
      const comparePasswordsSpy = jest
        .spyOn(userById, 'comparePasswords')
        .mockReturnValue(true);
      const selectUserGroupSpy = jest
        .spyOn(userById, 'selectUserGroup')
        .mockReturnValue(2);
      const updateUserSetStateSpy = jest
        .spyOn(updateUserStatePort, 'updateUserState')
        .mockReturnValue(updatedUser);

      const res = await updateUserServce.updateUser(command);

      expect(loadUserByIdOneSpy).toHaveBeenCalledWith(
        command.id,
        command.userData,
      );
      expect(loadUserByIdOneSpy).toHaveBeenCalledTimes(1);

      expect(loadUserByNameSpy).toHaveBeenCalledWith(command.userData.userName);
      expect(loadUserByNameSpy).toHaveBeenCalledTimes(1);

      expect(comparePasswordsSpy).toHaveBeenCalledWith(
        userById.userOldPassword,
        userById.currentUserPasswordDecrypted,
      );
      expect(comparePasswordsSpy).toHaveBeenCalledTimes(1);

      expect(selectUserGroupSpy).toHaveBeenCalledWith(
        userByName.userNewNameHashed,
        userById.userId,
      );
      expect(selectUserGroupSpy).toHaveBeenCalledTimes(1);

      expect(updateUserSetStateSpy).toHaveBeenCalledWith(userById);
      expect(updateUserSetStateSpy).toHaveBeenCalledTimes(1);

      expect(res).toEqual(updatedUser);
    });

    it('should throw an error with status 403 and message "Invalid old password!"', async () => {
      const command = new UpdateUserCommand(1, createUserDataDto);

      jest
        .spyOn(loadUserByIdPortMock, 'loadUserById')
        .mockResolvedValue(userById);
      jest
        .spyOn(loadUserByNamePort, 'loadUserByName')
        .mockResolvedValue(userByName);
      jest.spyOn(userById, 'comparePasswords').mockReturnValue(false);
      jest.spyOn(userById, 'selectUserGroup').mockReturnValue(2);
      jest
        .spyOn(updateUserStatePort, 'updateUserState')
        .mockReturnValue(updatedUser);

      try {
        await updateUserServce.updateUser(command);
      } catch (e) {
        expect(e.message).toBe('Invalid old password!');
        expect(e.status).toBe(403);
      }
    });
  });
});

/*             const userDataDto = {
                "userName":"gdfgjuuyg978989sdhdsfdasdasdasdsudf",
                "userOldPassword":"veryStrongPassword",
                "userNewPassword":"veryStrongPassword",
                "signature": "ac46abebcd7c8255f61f82afe7e57aec"
            } */

/* const userById = new UserEntity(
                'b8ea7132aeb096a3cdc8cd453075f8bd53ead6120baf545299e4949aeb9ff5ba',
                'Z2ZpVzdtNVFsRmtSQ0FUYUtlcWZXZXh3a1VZcU9XL0ZEdDJRaU5XSHVVWT0tLWJxTHpUY3J0SXFNSXQ0ZkhPRm1zbHc9PQ==',
                'veryStrongPassword',
                14,
                'b8ea7132aeb096a3cdc8cd453075f8bd53ead6120baf545299e4949aeb9ff5ba',
                'veryStrongPassword',
                'aUhWM2dRMC9XY2E1R1ZianJ3WTBNZVpNaHNMWmM4L3RzTWdkYWw1NjBJVT0tLW5kb2hrbERTcHRQOUlnZWs1dVdRMWc9PQ==',
            ); */

/*          const userOldPassword = 'veryStrongPassword';
            const currentUserPasswordDecrypted = 'veryStrongPassword';
            const userNewNameHashed = 'b8ea7132aeb096a3cdc8cd453075f8bd53ead6120baf545299e4949aeb9ff5ba'; */

/*            const result = await updateUserService.updateUser(command);
                console.log(result);

            const expectedResult = {
                "id": 14,
                "userNameHashed": "b8ea7132aeb096a3cdc8cd453075f8bd53ead6120baf545299e4949aeb9ff5ba",
                "userPasswordEncrypted": "aUhWM2dRMC9XY2E1R1ZianJ3WTBNZVpNaHNMWmM4L3RzTWdkYWw1NjBJVT0tLW5kb2hrbERTcHRQOUlnZWs1dVdRMWc9PQ==",
                "group": 2
            }

            expect(result).toEqual(expectedResult); */

/*  const userData = {
            "currentUserNameHashed" : 'Slava',
            "currentUserPasswordEncrypted": 'sdasdasdasdasd',
            "currentUserPasswordDecrypted": 'asdasddaasdaw34',
            "userId": 3,
            "userNewNameHashed": "dsdasdawqeqweqwe",
            "userOldPassword": 'asdasddaasdaw34',
            "userNewPasswordEncrypted": 'sadasdqwe3e',
            "isSameNameUser": 'Slava'
        } */

/* 
        const result = {
            "id": 8,
            "userNameHashed": "2e55ca06d95608c42155a5014577c095562ce50d6224e0771e06bfa2914ce53a",
            "userPasswordEncrypted": "a0hROFN6Y2tGNVhqeTBHeXUwWisyRDVRZzNvMUxjWVlCTjJOSi84M1NyOD0tLTdxSC8yY3RwUk9uYWd2L3l4VXdWYnc9PQ==",
            "group": 2
        } */
