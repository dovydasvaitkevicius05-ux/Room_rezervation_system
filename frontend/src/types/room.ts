export interface RoomDto {
  id: number;
  name: string;
  capacity: number;
  floor: number;
  location: string;
  equipment: number[];
  status: number;
}

export interface CreateRoomDto {
  name: string;
  maxCapacity: number;
  floor: number;
  location: string;
  equipment: number[];
  status: number;
}

export interface UpdateRoomDto {
  name: string;
  maxCapacity: number;
  floor: number;
  location: string;
  equipment: number[];
  status: number;
}