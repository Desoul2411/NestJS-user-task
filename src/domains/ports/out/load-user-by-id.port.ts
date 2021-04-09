import { UserEntity, UserId } from 'src/domains/entities/user.entity';
import { CreateUserDataDto } from 'src/modules/user-web/dto/create-user-data.dto';


export interface LoadUserByIdPort {
	loadUserById(userId: UserId ,userData: CreateUserDataDto): Promise<UserEntity>;
} 