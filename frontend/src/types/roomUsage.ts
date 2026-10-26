/**
 * Represents room details and reservation usage statistics.
 * Includes room information, total reservations, and cancellations.
 */
export interface RoomUsageDto {
  roomId: number;
  roomName: string;
  capacity: number;
  floor: number;
  location: string;
  equipment: number[];
  status: number;

  // Track the total number of reservations for the room.
  reservationCount: number;
  // Track the number of canceled reservations for the room.
  cancelledReservationCount: number;
}