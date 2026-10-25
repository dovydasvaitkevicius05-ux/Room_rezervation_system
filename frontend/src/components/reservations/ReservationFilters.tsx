import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { RESERVATION_STATUS_OPTIONS } from "../../constants/ReservationOptions";
import type { RoomDto } from "../../types/room";
import type { UserDto } from "../../types/user";
import { DateField } from "../common/DateField";

// Visos reikšmės laikomos kaip tekstas, nes tai formos laukų reikšmės.
// Į skaičius ir datas jas paverčia ReservationsPage prieš siunčiant užklausą.
export interface ReservationFilterValues {
  roomId: string; // "" = visi kambariai
  organizerId: string; // "" = visi organizatoriai
  status: string; // "" = visos būsenos
  from: string; // YYYY-MM-DD arba ""
  to: string; // YYYY-MM-DD arba ""
}

export type ReservationFilterErrors = Partial<
  Record<keyof ReservationFilterValues, string>
>;

export const EMPTY_RESERVATION_FILTER_VALUES: ReservationFilterValues = {
  roomId: "",
  organizerId: "",
  status: "",
  from: "",
  to: "",
};

interface ReservationFiltersProps {
  values: ReservationFilterValues;
  errors?: ReservationFilterErrors;
  rooms: RoomDto[];
  users: UserDto[];
  disabled?: boolean;
  onChange: (values: ReservationFilterValues) => void;
  onApply: () => void;
  onReset: () => void;
}

export function ReservationFilters({
  values,
  errors = {},
  rooms,
  users,
  disabled = false,
  onChange,
  onApply,
  onReset,
}: ReservationFiltersProps) {
  return (
    <Box
      component="form"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onApply();
      }}
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "flex-start",
      }}
    >
      <FormControl size="small" sx={{ width: 220 }} disabled={disabled}>
        <InputLabel id="reservation-filter-room-label" shrink>
          Kambarys
        </InputLabel>
        <Select
          labelId="reservation-filter-room-label"
          label="Kambarys"
          displayEmpty
          notched
          value={values.roomId}
          onChange={(event) =>
            onChange({ ...values, roomId: String(event.target.value) })
          }
        >
          <MenuItem value="">Visi</MenuItem>
          {rooms.map((room) => (
            <MenuItem key={room.id} value={String(room.id)}>
              {room.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ width: 220 }} disabled={disabled}>
        <InputLabel id="reservation-filter-organizer-label" shrink>
          Organizatorius
        </InputLabel>
        <Select
          labelId="reservation-filter-organizer-label"
          label="Organizatorius"
          displayEmpty
          notched
          value={values.organizerId}
          onChange={(event) =>
            onChange({ ...values, organizerId: String(event.target.value) })
          }
        >
          <MenuItem value="">Visi</MenuItem>
          {users.map((user) => (
            <MenuItem key={user.id} value={String(user.id)}>
              {user.name} {user.surname}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ width: 170 }} disabled={disabled}>
        <InputLabel id="reservation-filter-status-label" shrink>
          Būsena
        </InputLabel>
        <Select
          labelId="reservation-filter-status-label"
          label="Būsena"
          displayEmpty
          notched
          value={values.status}
          onChange={(event) =>
            onChange({ ...values, status: String(event.target.value) })
          }
        >
          <MenuItem value="">Visos</MenuItem>
          {RESERVATION_STATUS_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={String(option.value)}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <DateField
        label="Data nuo"
        type="date"
        size="small"
        width={170}
        value={values.from}
        onChange={(from) => onChange({ ...values, from })}
        error={errors.from}
        disabled={disabled}
      />

      <DateField
        label="Data iki"
        type="date"
        size="small"
        width={170}
        value={values.to}
        onChange={(to) => onChange({ ...values, to })}
        error={errors.to}
        disabled={disabled}
      />

      <Box sx={{ display: "flex", gap: 1 }}>
        <Button type="submit" variant="contained" disabled={disabled}>
          Filtruoti
        </Button>
        <Button type="button" onClick={onReset} disabled={disabled}>
          Išvalyti
        </Button>
      </Box>
    </Box>
  );
}

export default ReservationFilters;