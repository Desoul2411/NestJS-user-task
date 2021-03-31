
import { UserEntity,  } from 'src/domains/entities/user.entity';

export interface LoadAccountPort {
	loadAccount(accountId: AccountId): Promise<UserEntity>;
}