import { Expose } from 'class-transformer';
import { UserInfoDto } from './user-info.dto';

export class AuthResponseDto {
  @Expose()
  access_token: string;

  @Expose()
  user: UserInfoDto;

  @Expose()
  expires_in: number;

  @Expose()
  token_type: string = 'Bearer';
}