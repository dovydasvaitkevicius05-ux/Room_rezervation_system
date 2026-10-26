import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { reservationService } from "../../services/ReservationService";
import type { ReservationDto } from "../../types/reservation";

// Define the locales supported by the calendar date formatting.
const locales = {
  "en-US": enUS,
};

// Create the date-fns localizer required by react-big-calendar.
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

/**
 * Props accepted by the RoomTimelineDialog component.
 */
interface Props {
  // Controls whether the dialog is visible.
  open: boolean;
  // ID of the room whose reservations are shown, or null if none is selected.
  roomId: number | null;
  // Name of the room displayed in the dialog title.
  roomName: string;
  // Called when the user closes the dialog.
  onClose: () => void;
}

/**
 * Renders a dialog with a weekly calendar showing all reservations
 * of the selected room. Reservations are loaded when the dialog opens.
 */
export function RoomTimelineDialog({
  open,
  roomId,
  roomName,
  onClose,
}: Props) {
  // Track whether the reservations are currently being loaded.
  const [loading, setLoading] = useState(false);
  // Store the reservations converted to calendar events.
  const [events, setEvents] = useState<any[]>([]);

  // Load the room reservations whenever the dialog is opened or the room changes.
  useEffect(() => {
    // Skip loading if the dialog is closed or no room is selected.
    if (!open || !roomId) return;

    const loadReservations = async () => {
      setLoading(true);

      try {
        // Fetch all reservations that belong to the selected room.
        const reservations = await reservationService.getFiltered({ roomId });

        // Convert the reservations to the event format expected by the calendar.
        setEvents(
          reservations.map((reservation: ReservationDto) => ({
            id: reservation.id,
            title: reservation.title,
            start: new Date(reservation.plannedStart),
            end: new Date(reservation.plannedEnd),
          }))
        );
      } finally {
        // Hide the loading indicator even if the request fails.
        setLoading(false);
      }
    };

    void loadReservations();
  }, [roomId, open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      {/* Display the dialog title with the room name. */}
      <DialogTitle>Weekly Timeline - {roomName}</DialogTitle>

      <DialogContent>
        {/* Show a spinner while loading, otherwise render the weekly calendar. */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 4,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultView="week"
            views={["week"]}
            style={{
              height: 600,
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default RoomTimelineDialog;