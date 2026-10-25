export interface RoomUsageDto {
  roomId: number;
  roomName: string;
  capacity: number;
  floor: number;
  location: string;
  equipment: number[];
  status: number;

  reservationCount: number;
  cancelledReservationCount: number;
}