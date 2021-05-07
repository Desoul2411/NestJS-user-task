import { UserEntity } from '../../domains/entities/user.entity';
import { UserOrmEntity } from './user.orm.entity';

export class UserMapper {
  static mapUserByNametoDomain(foundByNameUser: UserOrmEntity): UserEntity {
    return new UserEntity(
      null,
      null,
      null,
      null,
      foundByNameUser && foundByNameUser.userNameHashed,
      null,
      null,
    );
  }

  static mapUserByIdtoDomain(
    foundByIdUser: UserOrmEntity,
    userOldPassword: string,
    foundByIdUserDecryptedPasword: string,
    userNewPasswordEncrypted: string,
    userNewNameHashed: string,
  ): UserEntity {
    return new UserEntity(
      foundByIdUser.userNameHashed,
      foundByIdUser.userPasswordEncrypted,
      foundByIdUserDecryptedPasword,
      foundByIdUser.id,
      userNewNameHashed,
      userOldPassword,
      userNewPasswordEncrypted,
    );
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
