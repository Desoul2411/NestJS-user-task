import { UserId } from 'src/domains/entities/user.entity';
import { CreateUserDataDto } from 'src/modules/user-web/dto/create-user-data.dto';

export class UpdateUserCommand {
  constructor(
    private readonly _id: UserId,
    private readonly _userData: CreateUserDataDto,
  ) {}

  get id(): UserId {
    return this._id;
  }

  get userData(): CreateUserDataDto {
    return this._userData;
  }
}
