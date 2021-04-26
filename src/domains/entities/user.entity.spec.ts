import { UserEntity, UserId } from './user.entity';
import * as mathUtils from '../../modules/utils/functions-helpers/math.utils';
import { generateString } from '../../modules/utils/testing-helpers/generators.utils';


jest.mock('../../modules/utils/functions-helpers/math.utils', () => ({
  factorial: jest.fn(),
  fib: jest.fn()
}));

describe('UserEntity', () => {
    let passwordGenerated;
    
    beforeEach(async () => {
        passwordGenerated = generateString(64);
    });

    describe('comparePasswords', () => {
        it('passwords match - should return true', () => {
            const userById = new UserEntity(
                '8ab93ab71fe07dc816c8650a8d3ad3f98bd5743957aa732816ad82955c9e2840',   // _currentUserNameHashed
                passwordGenerated,
                passwordGenerated,
                1,
                '8ab93ab71fe07dc816c8650a8d3ad3f98bd5743957aa732816ad82955c9e2840',  // _userNewNameHashed
                passwordGenerated,
                passwordGenerated,
            );

            expect(userById.comparePasswords(userById.userOldPassword, userById.currentUserPasswordDecrypted)).toBeTruthy();
        });

        it('passwords mismatch - should return false', () => {
            const oldPasswordGenerated = generateString(64);
            const userById = new UserEntity(
                '8ab93ab71fe07dc816c8650a8d3ad3f98bd5743957aa732816ad82955c9e2840',
                passwordGenerated,
                passwordGenerated,
                1,
                '8ab93ab71fe07dc816c8650a8d3ad3f98bd5743957aa732816ad82955c9e2840',
                oldPasswordGenerated,
                passwordGenerated,
            );

            expect(userById.comparePasswords(userById.userOldPassword, userById.currentUserPasswordDecrypted)).toBeFalsy();
        });
    });


    describe('selectUserGroup', () => { 
        it('should return 1', () => {
            const userById = new UserEntity(
                '8ab93ab71fe07dc816c8650a8d3ad3f98bd5743957aa732816ad82955c9e2840',
                passwordGenerated,
                passwordGenerated,
                1,
                '8ab93ab71fe07dc816c8650a8d3ad3f98bd5743957aa732816ad82955c9e2840',
                passwordGenerated,
                passwordGenerated,
            );
    
            const userByName = new UserEntity(
                null,
                null,
                null,
                null,
                '8ab93ab71fe07dc816c8650a8d3ad3f98bd5743957aa732816ad82955c9e2840',
                null,
                null
            );
    
            (mathUtils.factorial as jest.Mock).mockImplementation(() => 3);
            (mathUtils.fib as jest.Mock).mockImplementation(() => 1);
     
            expect(userById.selectUserGroup(userByName.userNewNameHashed,userById.userId)).toBe(1);
        });

        it('should return 2', () => {
            const userById = new UserEntity(
                '8ab93ab71fe07dc816c8650a8d3ad3f98bd5743957aa732816ad82955c9e2840',
                passwordGenerated,
                passwordGenerated,
                1,
                '8ab93ab71fe07dc816c8650a8d3ad3f98bd5743957aa732816ad82955c9e2840',
                passwordGenerated,
                passwordGenerated,
            );
    
            const userByName = new UserEntity(
                null,
                null,
                null,
                null,
                '8ab93ab71fe07dc816c8650a8d3ad3f98bd5743957aa732816ad82955c9e2840',
                null,
                null
            );
    
            (mathUtils.factorial as jest.Mock).mockImplementation(() => 3);
            (mathUtils.fib as jest.Mock).mockImplementation(() => 2);
    
            expect(userById.selectUserGroup(userByName.userNewNameHashed,userById.userId)).toBe(2);
        });

        it('should return 3', () => {
            const userById = new UserEntity(
                '8ab93ab71fe07dc816c8650a8d3ad3f98bd5743957aa732816ad82955c9e2840',
                passwordGenerated,
                passwordGenerated,
                1,
                '8ab93ab71fe07dc816c8650a8d3ad3f98bd5743957aa732816ad82955c9e2840',
                passwordGenerated,
                passwordGenerated,
            );
    
            const userByName = new UserEntity(
                null,
                null,
                null,
                null,
                undefined,
                null,
                null
            );
    
            (mathUtils.factorial as jest.Mock).mockImplementation(() => 3);
            (mathUtils.fib as jest.Mock).mockImplementation(() => 2);
    
            expect(userById.selectUserGroup(userByName.userNewNameHashed,userById.userId)).toBe(3);
        });
    });
});
