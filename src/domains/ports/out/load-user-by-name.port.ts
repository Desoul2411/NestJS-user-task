import { UserEntity, UserName } from 'src/domains/entities/user.entity';

export interface LoadUserByNamePort {
  loadUserByName(userName: UserName): Promise<UserEntity>;
}
