import { UserEntity } from 'src/domains/entities/user.entity';
import { UserOrmEntity } from './user.orm.entity';

export class UserMapper {
    static mapToDomain(
        user: UserOrmEntity
    ): UserEntity {
        return new UserEntity(
            user.id,
            user.userNameHashed,
            user.userPasswordEncrypted,
            user.group
        )
    }


    static mapToUserOrmEntity(user: UserEntity): UserOrmEntity {
        const userOrmEntity = new UserOrmEntity();
        userOrmEntity.userNameHashed = user.userNameHashed;
        userOrmEntity.userPasswordEncrypted = user.userPasswordEncrypted;
        userOrmEntity.group = user.group;

        return userOrmEntity;
    }
}