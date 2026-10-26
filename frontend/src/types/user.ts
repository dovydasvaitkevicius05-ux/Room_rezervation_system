/**
 * Represents a user returned by the API.
 * Includes user details and associated reservation IDs.
 */
export interface UserDto {
  id: number;
  name: string;
  surname: string;
  reservationIds: number[];
}

/**
 * Defines the data required to create a user.
 * The API assigns the user ID and initializes their reservations.
 */
export interface CreateUserDto {
  name: string;
  surname: string;
}

/**
 * Defines the data required to update an existing user.
 * Contains the editable user details.
 */
export interface UpdateUserDto {
  name: string;
  surname: string;
}