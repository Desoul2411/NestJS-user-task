import { UserEntity } from 'src/domains/entities/user.entity';
import { UserOrmEntity } from './user.orm.entity';

export class UserMapper {
    static mapToDomain(
        currentUser: UserOrmEntity,
        currentUserDecryptedPasword: string,
        userId: number,
        userNameHashed: string,
        userOldPassword: string,
        userPasswordEncrypted: string,
        isSameNameUser: string
    ): UserEntity {
        return new UserEntity(  
            currentUser.userNameHashed,
            currentUser.userPasswordEncrypted,
            currentUserDecryptedPasword,
            userId,
            userNameHashed,
            userOldPassword,
            userPasswordEncrypted,
            isSameNameUser
        )
    }

    static mapToUserOrmEntity(user: UserEntity): UserOrmEntity {
        const userOrmEntity = new UserOrmEntity();
        userOrmEntity.id = +user.userId;
        userOrmEntity.userNameHashed = user.userNewNameHashed;
        userOrmEntity.userPasswordEncrypted = user.userNewPasswordEncrypted;
        userOrmEntity.group = user.group;

        return userOrmEntity;
    }
}