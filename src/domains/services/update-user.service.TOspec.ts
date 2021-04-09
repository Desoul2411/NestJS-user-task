import {mock, when, anything, anyString, instance, anyNumber} from 'ts-mockito';
import {LoadUserByIdPort} from '../ports/out/load-user-by-id.port';
import {LoadUserByNamePort} from '../ports/out/load-user-by-name.port';
import {UpdateUserStatePort} from '../ports/out/update-user-port';
import {UserEntity, UserId} from '../entities/user.entity';
import {CreateUserDataDto} from '../../modules/user-web/dto/create-user-data.dto';
import {UpdateUserCommand} from '../ports/in/update-user.command';
import {UpdateUserService} from './update-user.service';


describe('UpdateUserService', () => {
    describe('updateUser', () => {
        it ('should return updated user', async () => {
            const loadUserByIdPort = mock<LoadUserByIdPort>();
            const loadUserByNamePort = mock<LoadUserByNamePort>();
            const updateUserStatePort = mock<UpdateUserStatePort>();

            //const userData: CreateUserDataDto = mock(CreateUserDataDto);

            const userDataDto = {
                "userName":"gdfgjuuyg978989sdhdsfdasdasdasdsudf",
                "userOldPassword":"veryStrongPassword",
                "userNewPassword":"veryStrongPassword",
                "signature": "ac46abebcd7c8255f61f82afe7e57aec"
            }


            /* const userById = new UserEntity(
                'b8ea7132aeb096a3cdc8cd453075f8bd53ead6120baf545299e4949aeb9ff5ba',
                'Z2ZpVzdtNVFsRmtSQ0FUYUtlcWZXZXh3a1VZcU9XL0ZEdDJRaU5XSHVVWT0tLWJxTHpUY3J0SXFNSXQ0ZkhPRm1zbHc9PQ==',
                'veryStrongPassword',
                14,
                'b8ea7132aeb096a3cdc8cd453075f8bd53ead6120baf545299e4949aeb9ff5ba',
                'veryStrongPassword',
                'aUhWM2dRMC9XY2E1R1ZianJ3WTBNZVpNaHNMWmM4L3RzTWdkYWw1NjBJVT0tLW5kb2hrbERTcHRQOUlnZWs1dVdRMWc9PQ==',
            ); */

            const userOldPassword = 'veryStrongPassword';
            const currentUserPasswordDecrypted = 'veryStrongPassword';
            const userNewNameHashed = 'b8ea7132aeb096a3cdc8cd453075f8bd53ead6120baf545299e4949aeb9ff5ba';


            function createUserByIdWithData(id: UserId, userDataDto: CreateUserDataDto) {
                const mockedUserEntity = mock(UserEntity);

               // const mockedUserEntityByName = mock(UserEntity);
            
                when(mockedUserEntity.userOldPassword).thenReturn(userOldPassword);
                when(mockedUserEntity.currentUserPasswordDecrypted).thenReturn(currentUserPasswordDecrypted);
                when(mockedUserEntity.userId).thenReturn(id);
                //when(mockedUserEntityByName.userNewNameHashed).thenReturn(userNewNameHashed);

                when(mockedUserEntity.comparePasswords(anyString(), anyString())).thenReturn(true);
                //when(mockedUserEntity.selectUserGroup(anything(), anyString())).thenReturn(anyNumber());

                let user = instance(mockedUserEntity);
                console.log('user',userById);
                when(loadUserByIdPort.loadUserById(id,userDataDto)).thenReturn(Promise.resolve(user));

                return user;
            }

            const userById = createUserByIdWithData(14, userDataDto);

             
            
            /* 
            function createUserByNameWithData(userName: string) {
                const mockedUserEntity = mock(UserEntity);

                when(mockedUserEntity.userNewNameHashed).thenReturn(userNewNameHashed);
                let userByName = instance(mockedUserEntity);
                when(loadUserByNamePort.loadUserByName(userName)).thenReturn(Promise.resolve(userByName));

                return userByName;
            }

            const userByName = createUserByNameWithData(userNewNameHashed); */
      
         

            const command = new UpdateUserCommand(
                14,
                userDataDto
            )

            

            const updateUserService = new UpdateUserService(
                instance(loadUserByIdPort),
                instance(loadUserByNamePort),
                instance(updateUserStatePort)
            );



/*             const userById = loadUserByIdPort.loadUserById(14,userDataDto)
            loadUserByNamePort.loadUserByName(userNewNameHashed) */

            const result = await updateUserService.updateUser(command);
                console.log(result);

            const expectedResult = {
                "id": 14,
                "userNameHashed": "b8ea7132aeb096a3cdc8cd453075f8bd53ead6120baf545299e4949aeb9ff5ba",
                "userPasswordEncrypted": "aUhWM2dRMC9XY2E1R1ZianJ3WTBNZVpNaHNMWmM4L3RzTWdkYWw1NjBJVT0tLW5kb2hrbERTcHRQOUlnZWs1dVdRMWc9PQ==",
                "group": 2
            }

            expect(result).toEqual(expectedResult);
        });
    });
});



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