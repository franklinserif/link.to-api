import { User } from '@users/entities/user.entity';

export interface Signup {
  user: User;
  token: string;
  refreshToken: string;
}
