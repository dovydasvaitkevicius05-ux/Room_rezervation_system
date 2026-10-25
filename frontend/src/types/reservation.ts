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

export interface CreateReservationDto {
  roomId: number;
  organizerId: number;
  title: string;
  plannedStart: string;
  plannedEnd: string;
  participantCount: number;
}

export interface UpdateReservationDto {
  roomId: number;
  organizerId: number;
  title: string;
  plannedStart: string;
  plannedEnd: string;
  participantCount: number;
}