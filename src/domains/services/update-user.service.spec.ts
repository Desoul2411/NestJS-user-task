import {mock, when, anything, anyString, instance} from 'ts-mockito';
import {LoadUserPort} from '../ports/out/load-user.port';
import {UpdateUserStatePort} from '../ports/out/update-user-port';
import {UserEntity, UserId} from '../entities/user.entity';
import {CreateUserDataDto} from '../../modules/user-web/dto/create-user-data.dto';
import {UpdateUserCommand} from '../ports/in/update-user.command';
import {UpdateUserService} from '../services/update-user.service';


describe('UpdateUserService', () => {
	it ('should return updated user', async () => {
		const loadUserPort = mock<LoadUserPort>();
		const updateUserStatePort = mock<UpdateUserStatePort>();

        //const userData: CreateUserDataDto = mock(CreateUserDataDto);

        const userData = {
            "userName":"retretretre",
            "userOldPassword":"veryStrongPassword",
            "userNewPassword":"veryStrongPassword",
            "signature": "ac46abebcd7c8255f61f82afe7e57aec"
        }

        const userOldPassword = '1234';
        const currentUserPasswordDecrypted = '1234';
        const isSameNameUser = 'Slava'

		function createUserWithData(id: UserId, userData: CreateUserDataDto) {
			const mockedUserEntity = mock(UserEntity);
            
			when(mockedUserEntity.userId).thenReturn(id);

            
            when(mockedUserEntity.userOldPassword).thenReturn(userOldPassword);
            when(mockedUserEntity.currentUserPasswordDecrypted).thenReturn(currentUserPasswordDecrypted);
            //when(userData).thenReturn(userDatacontent);

			when(mockedUserEntity.comparePasswords(anyString(), anyString())).thenReturn(true);
			when(mockedUserEntity.selectUserGroup(anything(), anything())).thenReturn(true);
			const user = instance(mockedUserEntity);
			when(loadUserPort.loadUser(id,userData)).thenReturn(Promise.resolve(user));
			return user;
		}

		const user = createUserWithData(8, userData);
        console.log(user);

		const command = new UpdateUserCommand(
			user.userId,
			userData
		)

		const updateUserService = new UpdateUserService(
			instance(loadUserPort),
			instance(updateUserStatePort)
		);

		const result = await updateUserService.updateUser(command);
        console.log(result);

        const expectedResult = {
            "id": 8,
            "userNameHashed": "2e55ca06d95608c42155a5014577c095562ce50d6224e0771e06bfa2914ce53a",
            "userPasswordEncrypted": "a0hROFN6Y2tGNVhqeTBHeXUwWisyRDVRZzNvMUxjWVlCTjJOSi84M1NyOD0tLTdxSC8yY3RwUk9uYWd2L3l4VXdWYnc9PQ==",
            "group": 2
        }

		expect(result).toBe(expectedResult);
	})
})




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