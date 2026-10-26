/**
 * Represents a reservation returned by the API.
 * Includes reservation details and its current status.
 */
export interface ReservationDto {
  id: number;
  organizerId: number;
  roomId: number;
  title: string;
  plannedStart: string;
  plannedEnd: string;
  participantCount: number;
  status: number;
}

/**
 * Defines the data required to create a reservation.
 * The API assigns the reservation ID and status.
 */
export interface CreateReservationDto {
  roomId: number;
  organizerId: number;
  title: string;
  plannedStart: string;
  plannedEnd: string;
  participantCount: number;
}

/**
 * Defines the data required to update an existing reservation.
 * Contains the editable reservation details.
 */
export interface UpdateReservationDto {
  roomId: number;
  organizerId: number;
  title: string;
  plannedStart: string;
  plannedEnd: string;
  participantCount: number;
}