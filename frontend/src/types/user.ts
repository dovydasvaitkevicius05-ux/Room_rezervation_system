export interface UserDto {
  id: number;
  name: string;
  surname: string;
  reservationIds: number[];
}

export interface CreateUserDto {
  name: string;
  surname: string;
}

export interface UpdateUserDto {
  name: string;
  surname: string;
}