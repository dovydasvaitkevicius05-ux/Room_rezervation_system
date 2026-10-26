// Values must match the backend enums:
// MeetingRoomBooking.Models.Enums.RoomStatus and RoomEquipment

/**
 * Numeric room status codes used by the API.
 */
export const RoomStatus = {
  // The room is available for reservations.
  Active: 0,
  // The room is not available for reservations.
  Inactive: 1,
} as const;

/**
 * Numeric room equipment codes used by the API.
 */
export const RoomEquipment = {
  Projector: 0,
  TVScreen: 1,
  VideoConferencing: 2,
  Whiteboard: 3,
} as const;

/**
 * Describes an option for display, for example in dropdowns.
 */
export interface SelectOption {
  // Numeric code, matching the values of the corresponding enum constant.
  value: number;
  // Human-readable label shown to the user.
  label: string;
}

// Define the list of room statuses with their display labels.
export const STATUS_OPTIONS: SelectOption[] = [
  { value: RoomStatus.Active, label: "Active" },
  { value: RoomStatus.Inactive, label: "Inactive" },
];

// Define the list of room equipment with their display labels.
export const EQUIPMENT_OPTIONS: SelectOption[] = [
  { value: RoomEquipment.Projector, label: "Projector" },
  { value: RoomEquipment.TVScreen, label: "TV Screen" },
  { value: RoomEquipment.VideoConferencing, label: "Video Conferencing" },
  { value: RoomEquipment.Whiteboard, label: "Whiteboard" },
];

/**
 * Returns the display label for the given room status code.
 * Falls back to "Unknown (code)" if the status is not recognized.
 */
export function getStatusLabel(status: number): string {
  return (
    STATUS_OPTIONS.find((option) => option.value === status)?.label ??
    `Unknown (${status})`
  );
}

/**
 * Returns the display label for the given equipment code.
 * Falls back to "Unknown (code)" if the equipment is not recognized.
 */
export function getEquipmentLabel(equipment: number): string {
  return (
    EQUIPMENT_OPTIONS.find((option) => option.value === equipment)?.label ??
    `Unknown (${equipment})`
  );
}