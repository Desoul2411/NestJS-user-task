
export type UserName = string;
export type UserOldPassword = string;
export type UserNewPassword = string;
export type Signature = string; 
 

export type UserId = number | null;
export type UserNameHashed = string;
export type UserPasswordEncrypted = string;
export type Group = number;



export class UserEntity {
    
    
	constructor(
	/* 	private readonly _id: UserId,
        private readonly _userName: UserName,
		private readonly _userOldPassword: UserOldPassword,
		private readonly _userNewPassword: UserNewPassword,
        private readonly _signature: Signature, */
      /*   private readonly _userOldPassword: UserOldPassword, */
        private readonly _userNameHashed: UserNameHashed,
        private readonly _userPasswordEncrypted: UserPasswordEncrypted,
        private readonly _group: Group,
        private readonly _id?: UserId
	) {}



    get id(): UserId {
        return this._id;
    }

    get userNameHashed(): UserNameHashed {
        return this._userNameHashed;
    }

    get userPasswordEncrypted(): UserPasswordEncrypted {
        return this._userPasswordEncrypted;
    }
    
    get group(): Group {
        return this._group;
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