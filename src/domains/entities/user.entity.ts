/* export type UserId = number;
export type UserName = string;
export type UserPassword = string;
export type UserGroup = number; */

export interface UserInterface  {    
    userId: number;
    userName: string;
    userPassword: string;
    userGroup: number;
}


export class UserEntity implements UserInterface {
	constructor(
		private readonly _userId,
		private readonly _userName,
		private readonly _userPassword,
        private readonly _userGroup
	) {}


    get userId() {
        return this._userId
    }

    get userName() {
        return this._userName;
    }

    get userPassword() {
        return this._userPassword;
    }

    get userGroup() {
        return this._userGroup;
    }


    public selectUserGroup() {
        
    }



}