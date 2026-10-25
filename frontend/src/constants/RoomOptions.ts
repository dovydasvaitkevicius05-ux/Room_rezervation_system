// Reikšmės turi sutapti su backend enum'ais:
// MeetingRoomBooking.Models.Enums.RoomStatus ir RoomEquipment

export const RoomStatus = {
  Active: 0,
  Inactive: 1,
} as const;

export const RoomEquipment = {
  Projector: 0,
  TVScreen: 1,
  VideoConferencing: 2,
  Whiteboard: 3,
} as const;

export interface SelectOption {
  value: number;
  label: string;
}

export const STATUS_OPTIONS: SelectOption[] = [
  { value: RoomStatus.Active, label: "Aktyvus" },
  { value: RoomStatus.Inactive, label: "Neaktyvus" },
];

export const EQUIPMENT_OPTIONS: SelectOption[] = [
  { value: RoomEquipment.Projector, label: "Projektorius" },
  { value: RoomEquipment.TVScreen, label: "TV ekranas" },
  { value: RoomEquipment.VideoConferencing, label: "Vaizdo konferencijos" },
  { value: RoomEquipment.Whiteboard, label: "Baltoji lenta" },
];

export function getStatusLabel(status: number): string {
  return (
    STATUS_OPTIONS.find((option) => option.value === status)?.label ??
    `Nežinoma (${status})`
  );
}

export function getEquipmentLabel(equipment: number): string {
  return (
    EQUIPMENT_OPTIONS.find((option) => option.value === equipment)?.label ??
    `Nežinoma (${equipment})`
  );
}