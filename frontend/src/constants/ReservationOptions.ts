// Reikšmės turi sutapti su backend enum'u:
// MeetingRoomBooking.Models.Enums.ReservationStatus

export const ReservationStatus = {
  Booked: 0,
  Completed: 1,
  Cancelled: 2,
} as const;

export interface ReservationStatusOption {
  value: number;
  label: string;
}

export const RESERVATION_STATUS_OPTIONS: ReservationStatusOption[] = [
  { value: ReservationStatus.Booked, label: "Suplanuota" },
  { value: ReservationStatus.Completed, label: "Baigta" },
  { value: ReservationStatus.Cancelled, label: "Atšaukta" },
];

export function getReservationStatusLabel(status: number): string {
  return (
    RESERVATION_STATUS_OPTIONS.find((option) => option.value === status)
      ?.label ?? `Nežinoma (${status})`
  );
}