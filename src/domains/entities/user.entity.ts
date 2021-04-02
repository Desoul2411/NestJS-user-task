import { encrypt, decrypt, hashToSha256 } from "../../modules/utils/functions-helpers/cipher.utils";
import { factorial, fib } from "../../modules/utils/functions-helpers/math.utils";

export type UserName = string;
export type UserOldPassword = string;
export type UserNewPassword = string;
export type Signature = string; 
 

export type UserId = number | null;
export type UserNameHashed = string;
export type UserPasswordEncrypted = string;
export type UserPasswordDecrypted = string;
export type isSameNameUser = string | undefined;
export type Group = number;



export class UserEntity {

	constructor(
        private readonly _currentUserNameHashed: UserNameHashed,
        private readonly _currentUserPasswordEncrypted: UserPasswordEncrypted,
        private readonly _currentUserPasswordDecrypted: UserPasswordDecrypted,

        private readonly _userId: UserId,
        private readonly _userNewNameHashed: UserNameHashed,
        private readonly _userOldPassword: UserOldPassword,
        private readonly _userNewPasswordEncrypted: UserPasswordEncrypted,
        private readonly _isSameNameUser: isSameNameUser,
        private  group?: Group,
        
	) {}


    get currentUserNameHashed(): UserNameHashed {
        return this._currentUserNameHashed;
    }

    get currentUserPasswordDecrypted(): UserPasswordDecrypted {
        return this._currentUserPasswordDecrypted;
    }

    get currentUserPasswordEncrypted(): UserPasswordEncrypted {
        return this._currentUserPasswordEncrypted;
    }

    get userNewNameHashed(): UserNameHashed {
        return this._userNewNameHashed;
    }

    get userOldPassword(): UserOldPassword {
        return this._userOldPassword;
    }

    get userNewPasswordEncrypted(): UserPasswordEncrypted {
        return this._userNewPasswordEncrypted;
    }

    get isSameNameUser(): isSameNameUser {
        return this._isSameNameUser;
    }

    get userId(): UserId {
        return this._userId
    }
    
    
/*     get group(): Group {
        return this._group;
    }   
 */

    public comparePasswords(userOldPassword: string, currentUserPasswordDecrypted: string): boolean {
        if (userOldPassword === currentUserPasswordDecrypted) {
            return true;
        }
	}

    public selectUserGroup(isSameNameUser: isSameNameUser , userId: UserId): void {
        const checkNumber = Math.abs(factorial(userId) - fib(userId));
        console.log('checkNumber', checkNumber);
        let group;
    
        if (checkNumber % 2 === 0) {
          group = 1;
        } else {
          group = isSameNameUser ? 2 : 3;
        }
    
        this.group = group;
    }


     /* get signature(): Signature {
        return this._signature;
    } */


/*     get userId() {
        return this._id
    }

    get userName() {
        return this._userName;
    }

    get userPassword() {
        return this._userOldPassword;
    }

    get userGroup() {
        return this._userGroup;
    }

    public createUser() {

    }

    public updateUser() {

    } */


  /*   public selectUserGroup(): number {
        
    } */



}