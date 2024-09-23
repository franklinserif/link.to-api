import { User } from '@users/entities/user.entity';

export interface SignupResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
