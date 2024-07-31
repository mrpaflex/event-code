import { Expose, Type } from 'class-transformer';
import { Role } from 'src/common/enum/user-type.enum';

export class State_Of_Origin {
  @Expose()
  state: string;
  @Expose()
  local_government: string;
}
export class AddressInterface {
  @Expose()
  country: string;
  @Expose()
  lga: string;
  @Expose()
  zipCode: number;
  @Expose()
  providence: string;
  @Expose()
  city: string;
  @Expose()
  street_address: string;
}

export class IUser {
  @Expose()
  _id: string;

  @Expose()
  email: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  roles: Role;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  userName: string;

  @Expose()
  sex: string;

  @Expose()
  @Type(() => AddressInterface)
  address: AddressInterface;

  @Expose()
  @Type(() => State_Of_Origin)
  state_of_origin: State_Of_Origin;
}
export class LoginResponse {
  @Expose()
  @Type(() => IUser)
  user?: IUser;

  @Expose()
  @Type(() => IUser)
  vendor?: IUser;

  @Expose()
  accessToken: string;
}
