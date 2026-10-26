/**
 * Represents a room returned by the API.
 * Includes room details, equipment, and current status.
 */
export interface RoomDto {
  id: number;
  name: string;
  capacity: number;
  floor: number;
  location: string;
  equipment: number[];
  status: number;
}

/**
 * Defines the data required to create a room.
 * The API assigns the room ID and may derive its capacity from maxCapacity.
 */
export interface CreateRoomDto {
  name: string;
  maxCapacity: number;
  floor: number;
  location: string;
  equipment: number[];
  status: number;
}

/**
 * Defines the data required to update an existing room.
 * Contains the editable room details.
 */
export interface UpdateRoomDto {
  name: string;
  maxCapacity: number;
  floor: number;
  location: string;
  equipment: number[];
  status: number;
}