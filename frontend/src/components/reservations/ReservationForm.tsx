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

/**
 * Props accepted by the ReservationForm component.
 */
interface ReservationFormProps {
  // Controls whether the dialog is visible.
  open: boolean;
  // Rooms available for selection (only active rooms are shown).
  rooms: RoomDto[];
  // Users available for selection as the organizer.
  users: UserDto[];
  // Indicates whether the form is currently being submitted.
  submitting: boolean;
  // Server error displayed inside the form.
  error: string | null;
  // Called with the reservation data when the form is valid and submitted.
  onSubmit: (dto: CreateReservationDto) => void;
  // Called when the user closes the form without submitting.
  onCancel: () => void;
}

/**
 * Values of the reservation form fields.
 * All values are stored as strings, as they come directly from the inputs.
 */
interface FormValues {
  // ID of the selected room.
  roomId: string;
  // ID of the selected organizer.
  organizerId: string;
  // Meeting title.
  title: string;
  // Start time in datetime-local format: YYYY-MM-DDTHH:mm.
  plannedStart: string;
  // End time in datetime-local format: YYYY-MM-DDTHH:mm.
  plannedEnd: string;
  // Number of participants entered by the user.
  participantCount: string;
}

/**
 * Validation error messages for each form field.
 * A field has an entry only when its value is invalid.
 */
type FormErrors = Partial<Record<keyof FormValues, string>>;

// Define the default form values used when the form is opened.
const EMPTY_VALUES: FormValues = {
  roomId: "",
  organizerId: "",
  title: "",
  plannedStart: "",
  plannedEnd: "",
  participantCount: "",
};

/**
 * Parses a datetime-local string into a Date.
 * Returns null if the value is empty or not a valid date.
 */
function parseDateTime(value: string): Date | null {
  if (value === "") {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Converts a datetime-local value to the format expected by the API.
 * The input returns the value without seconds, so they are added here.
 */
function toApiDateTime(value: string): string {
  return value.length === 16 ? `${value}:00` : value;
}

/**
 * Validates the form values and returns the error messages for invalid fields.
 * Returns an empty object if all values are valid.
 */
function validate(values: FormValues, rooms: RoomDto[]): FormErrors {
  const errors: FormErrors = {};

  // Require a selected room.
  if (values.roomId === "") {
    errors.roomId = "Choose the room.";
  }

  // Require a selected organizer.
  if (values.organizerId === "") {
    errors.organizerId = "Choose the organizer.";
  }

  // Require a non-empty meeting title.
  if (values.title.trim() === "") {
    errors.title = "Enter the meeting title.";
  }

  const start = parseDateTime(values.plannedStart);
  const end = parseDateTime(values.plannedEnd);

  // Require a valid start time that is in the future.
  if (!start) {
    errors.plannedStart = "Enter the start time.";
  } else if (start <= new Date()) {
    errors.plannedStart = "The start time must be in the future.";
  }

  // Require a valid end time that is later than the start time.
  if (!end) {
    errors.plannedEnd = "Enter the end time.";
  } else if (start && end <= start) {
    errors.plannedEnd = "The end time must be later than the start time.";
  }

  // Require a whole number of participants that fits the selected room.
  const count = Number(values.participantCount);
  if (
    values.participantCount.trim() === "" ||
    !Number.isInteger(count) ||
    count < 1
  ) {
    errors.participantCount = "Enter a whole number from 1.";
  } else {
    const room = rooms.find((item) => String(item.id) === values.roomId);
    if (room && count > room.capacity) {
      errors.participantCount = `Room capacity – ${room.capacity}.`;
    }
  }

  return errors;
}

/**
 * Renders a dialog form for creating a new reservation.
 * Validates the input before calling onSubmit and shows server errors inside the form.
 */
export function ReservationForm({
  open,
  rooms,
  users,
  submitting,
  error,
  onSubmit,
  onCancel,
}: ReservationFormProps) {
  // Store the current field values and validation errors.
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});

  // The backend does not allow reserving inactive rooms, so they are not offered.
  const activeRooms = useMemo(
    () => rooms.filter((room) => room.status === RoomStatus.Active),
    [rooms]
  );

  // Clear the form every time it is opened.
  useEffect(() => {
    if (open) {
      setValues(EMPTY_VALUES);
      setErrors({});
    }
  }, [open]);

  // Validate the form and submit the reservation if there are no errors.
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // Prevent the default page reload.
    event.preventDefault();

    const validationErrors = validate(values, activeRooms);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Convert the string values to the types expected by the API.
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
    // Prevent closing the dialog by clicking outside while the form is being submitted.
    <Dialog
      open={open}
      onClose={submitting ? undefined : onCancel}
      fullWidth
      maxWidth="sm"
    >
      {/* Render the fields inside a form so it can also be submitted by pressing Enter. */}
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <DialogTitle>New Reservation</DialogTitle>

        <DialogContent>
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}
          >
            {/* Display the server error, if any. */}
            {error && <Alert severity="error">{error}</Alert>}

            {/* Input for the meeting title. */}
            <TextField
              label="Title"
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

            {/* Dropdown for selecting the room (active rooms only). */}
            <FormControl
              fullWidth
              required
              error={Boolean(errors.roomId)}
              disabled={submitting}
            >
              <InputLabel id="reservation-form-room-label">Room</InputLabel>
              <Select
                labelId="reservation-form-room-label"
                label="Room"
                value={values.roomId}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    roomId: String(e.target.value),
                  }))
                }
              >
                {/* Render one menu item for each active room. */}
                {activeRooms.map((room) => (
                  <MenuItem key={room.id} value={String(room.id)}>
                    {room.name} (capacity {room.capacity})
                  </MenuItem>
                ))}
              </Select>
              {/* Show the validation error or a hint when no rooms are available. */}
              {(errors.roomId || activeRooms.length === 0) && (
                <FormHelperText>
                  {errors.roomId ?? "No active rooms available."}
                </FormHelperText>
              )}
            </FormControl>

            {/* Dropdown for selecting the organizer. */}
            <FormControl
              fullWidth
              required
              error={Boolean(errors.organizerId)}
              disabled={submitting}
            >
              <InputLabel id="reservation-form-organizer-label">
                Organizer
              </InputLabel>
              <Select
                labelId="reservation-form-organizer-label"
                label="Organizer"
                value={values.organizerId}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    organizerId: String(e.target.value),
                  }))
                }
              >
                {/* Render one menu item for each user. */}
                {users.map((user) => (
                  <MenuItem key={user.id} value={String(user.id)}>
                    {user.name} {user.surname}
                  </MenuItem>
                ))}
              </Select>
              {/* Show the validation error or a hint when no users are available. */}
              {(errors.organizerId || users.length === 0) && (
                <FormHelperText>
                  {errors.organizerId ?? "No users available."}
                </FormHelperText>
              )}
            </FormControl>

            {/* Render the start and end time inputs side by side, wrapping on narrow screens. */}
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Box sx={{ flex: "1 1 220px" }}>
                <DateField
                  label="Start"
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
                  label="End"
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

            {/* Input for the number of participants. */}
            <TextField
              label="Participant Count"
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

        {/* Render the buttons for cancelling and submitting the form. */}
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? "Saving..." : "Create"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default ReservationForm;