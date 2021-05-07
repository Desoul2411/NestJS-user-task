import { UserEntity } from 'src/domains/entities/user.entity';

export interface UpdateUserStatePort {
  updateUserState(user: UserEntity);
}
