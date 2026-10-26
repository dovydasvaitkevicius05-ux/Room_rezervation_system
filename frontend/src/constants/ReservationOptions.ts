// Values must match the backend enum:
// MeetingRoomBooking.Models.Enums.ReservationStatus

/**
 * Numeric reservation status codes used by the API.
 */
export const ReservationStatus = {
  // The reservation is planned and has not finished or been cancelled.
  Booked: 0,
  // The reservation has finished.
  Completed: 1,
  // The reservation was cancelled.
  Cancelled: 2,
} as const;

/**
 * Describes a reservation status option for display, for example in dropdowns.
 */
export interface ReservationStatusOption {
  // Numeric status code, matching the values of ReservationStatus.
  value: number;
  // Human-readable label shown to the user.
  label: string;
}

// Define the list of reservation statuses with their display labels.
export const RESERVATION_STATUS_OPTIONS: ReservationStatusOption[] = [
  { value: ReservationStatus.Booked, label: "Planned" },
  { value: ReservationStatus.Completed, label: "Completed" },
  { value: ReservationStatus.Cancelled, label: "Cancelled" },
];

/**
 * Returns the display label for the given reservation status code.
 * Falls back to "Unknown (code)" if the status is not recognized.
 */
export function getReservationStatusLabel(status: number): string {
  return (
    RESERVATION_STATUS_OPTIONS.find((option) => option.value === status)
      ?.label ?? `Unknown (${status})`
  );
}