import { useEffect, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { RoomStatus } from "../../constants/RoomOptions";
import type { CreateReservationDto } from "../../types/reservation";
import type { RoomDto } from "../../types/room";
import type { UserDto } from "../../types/user";
import { DateField } from "../common/DateField";

interface ReservationFormProps {
  open: boolean;
  rooms: RoomDto[];
  users: UserDto[];
  submitting: boolean;
  /** Serverio klaida, rodoma formos viduje */
  error: string | null;
  onSubmit: (dto: CreateReservationDto) => void;
  onCancel: () => void;
}

interface FormValues {
  roomId: string;
  organizerId: string;
  title: string;
  plannedStart: string; // datetime-local: YYYY-MM-DDTHH:mm
  plannedEnd: string;
  participantCount: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const EMPTY_VALUES: FormValues = {
  roomId: "",
  organizerId: "",
  title: "",
  plannedStart: "",
  plannedEnd: "",
  participantCount: "",
};

function parseDateTime(value: string): Date | null {
  if (value === "") {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** datetime-local grąžina be sekundžių, todėl jas pridedame */
function toApiDateTime(value: string): string {
  return value.length === 16 ? `${value}:00` : value;
}

function validate(values: FormValues, rooms: RoomDto[]): FormErrors {
  const errors: FormErrors = {};

  if (values.roomId === "") {
    errors.roomId = "Pasirinkite kambarį.";
  }

  if (values.organizerId === "") {
    errors.organizerId = "Pasirinkite organizatorių.";
  }

  if (values.title.trim() === "") {
    errors.title = "Įveskite susitikimo pavadinimą.";
  }

  const start = parseDateTime(values.plannedStart);
  const end = parseDateTime(values.plannedEnd);

  if (!start) {
    errors.plannedStart = "Nurodykite pradžios laiką.";
  } else if (start <= new Date()) {
    errors.plannedStart = "Pradžia turi būti ateityje.";
  }

  if (!end) {
    errors.plannedEnd = "Nurodykite pabaigos laiką.";
  } else if (start && end <= start) {
    errors.plannedEnd = "Pabaiga turi būti vėlesnė už pradžią.";
  }

  const count = Number(values.participantCount);
  if (
    values.participantCount.trim() === "" ||
    !Number.isInteger(count) ||
    count < 1
  ) {
    errors.participantCount = "Įveskite sveikąjį skaičių nuo 1.";
  } else {
    const room = rooms.find((item) => String(item.id) === values.roomId);
    if (room && count > room.capacity) {
      errors.participantCount = `Kambario talpa – ${room.capacity}.`;
    }
  }

  return errors;
}

export function ReservationForm({
  open,
  rooms,
  users,
  submitting,
  error,
  onSubmit,
  onCancel,
}: ReservationFormProps) {
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});

  // Backend neleidžia rezervuoti neaktyvių kambarių, todėl jų nesiūlome
  const activeRooms = useMemo(
    () => rooms.filter((room) => room.status === RoomStatus.Active),
    [rooms]
  );

  // Kaskart atidarius formą ją išvalome
  useEffect(() => {
    if (open) {
      setValues(EMPTY_VALUES);
      setErrors({});
    }
  }, [open]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validate(values, activeRooms);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onSubmit({
      roomId: Number(values.roomId),
      organizerId: Number(values.organizerId),
      title: values.title.trim(),
      plannedStart: toApiDateTime(values.plannedStart),
      plannedEnd: toApiDateTime(values.plannedEnd),
      participantCount: Number(values.participantCount),
    });
  };

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onCancel}
      fullWidth
      maxWidth="sm"
    >
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <DialogTitle>Nauja rezervacija</DialogTitle>

        <DialogContent>
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}
          >
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Pavadinimas"
              value={values.title}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, title: e.target.value }))
              }
              error={Boolean(errors.title)}
              helperText={errors.title}
              disabled={submitting}
              autoFocus
              required
              fullWidth
            />

            <FormControl
              fullWidth
              required
              error={Boolean(errors.roomId)}
              disabled={submitting}
            >
              <InputLabel id="reservation-form-room-label">Kambarys</InputLabel>
              <Select
                labelId="reservation-form-room-label"
                label="Kambarys"
                value={values.roomId}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    roomId: String(e.target.value),
                  }))
                }
              >
                {activeRooms.map((room) => (
                  <MenuItem key={room.id} value={String(room.id)}>
                    {room.name} (talpa {room.capacity})
                  </MenuItem>
                ))}
              </Select>
              {(errors.roomId || activeRooms.length === 0) && (
                <FormHelperText>
                  {errors.roomId ?? "Nėra aktyvių kambarių."}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl
              fullWidth
              required
              error={Boolean(errors.organizerId)}
              disabled={submitting}
            >
              <InputLabel id="reservation-form-organizer-label">
                Organizatorius
              </InputLabel>
              <Select
                labelId="reservation-form-organizer-label"
                label="Organizatorius"
                value={values.organizerId}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    organizerId: String(e.target.value),
                  }))
                }
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={String(user.id)}>
                    {user.name} {user.surname}
                  </MenuItem>
                ))}
              </Select>
              {(errors.organizerId || users.length === 0) && (
                <FormHelperText>
                  {errors.organizerId ?? "Nėra vartotojų."}
                </FormHelperText>
              )}
            </FormControl>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Box sx={{ flex: "1 1 220px" }}>
                <DateField
                  label="Pradžia"
                  type="datetime-local"
                  fullWidth
                  value={values.plannedStart}
                  onChange={(plannedStart) =>
                    setValues((prev) => ({ ...prev, plannedStart }))
                  }
                  error={errors.plannedStart}
                  disabled={submitting}
                />
              </Box>
              <Box sx={{ flex: "1 1 220px" }}>
                <DateField
                  label="Pabaiga"
                  type="datetime-local"
                  fullWidth
                  value={values.plannedEnd}
                  onChange={(plannedEnd) =>
                    setValues((prev) => ({ ...prev, plannedEnd }))
                  }
                  error={errors.plannedEnd}
                  disabled={submitting}
                />
              </Box>
            </Box>

            <TextField
              label="Dalyvių skaičius"
              type="number"
              value={values.participantCount}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  participantCount: e.target.value,
                }))
              }
              error={Boolean(errors.participantCount)}
              helperText={errors.participantCount}
              disabled={submitting}
              required
              fullWidth
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onCancel} disabled={submitting}>
            Atšaukti
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? "Saugoma..." : "Sukurti"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default ReservationForm;