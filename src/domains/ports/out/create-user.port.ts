
import { UserEntity } from 'src/domains/entities/user.entity';
import { CreateUserDataDto } from 'src/modules/user-web/dto/create-user-data.dto';


export interface CreateUserPort {
	createUser(userData: CreateUserDataDto): Promise<UserEntity>;
}