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

/*     static mapToActivityWindow(activities: ActivityOrmEntity[]): ActivityWindowEntity {
		const activityWindowEntity = new ActivityWindowEntity();
		activities.forEach((activity) => {
			const activityEntity = new ActivityEntity(
				activity.ownerAccountId,
				activity.sourceAccountId,
				activity.targetAccountId,
				new Date(activity.timestamp),
				MoneyEntity.of(activity.amount),
				activity.id
			)
			activityWindowEntity.addActivity(activityEntity);
		})
		return activityWindowEntity;
	}
 */

    static mapToUserOrmEntity(user: UserEntity): UserOrmEntity {
        const userOrmEntity = new UserOrmEntity();
        userOrmEntity.userNameHashed = user.userNameHashed;
        userOrmEntity.userPasswordEncrypted = user.userPasswordEncrypted;
        userOrmEntity.group = user.group;

        return userOrmEntity;
    }
}