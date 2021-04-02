
import { UserEntity, UserId } from 'src/domains/entities/user.entity';
/* import { CreateUserDataDto } from 'src/modules/user-web/dto/create-user-data.dto'; */

/* export interface UpdateUserPort {
	updateUser(userId: UserId, createUserDto: CreateUserDataDto): Promise<UserEntity>;
} */


export interface UpdateUserStatePort {
	updateUserState(user: UserEntity)
} 