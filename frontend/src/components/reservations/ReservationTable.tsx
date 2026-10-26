import { useMemo } from "react";

import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import { ReservationStatus } from "../../constants/ReservationOptions";
import type { ReservationDto } from "../../types/reservation";
import type { RoomDto } from "../../types/room";
import type { UserDto } from "../../types/user";

import { ReservationStatusBadge } from "./ReservationStatusBadge";

/**
 * Defines the props required by the ReservationTable component.
 */
interface ReservationTableProps {
  reservations: ReservationDto[];
  rooms: RoomDto[];
  users: UserDto[];
  loading: boolean;
  actionId: number | null;
  onCancel: (reservation: ReservationDto) => void;
  onEndEarly: (reservation: ReservationDto) => void;
}

/**
 * Formats date and time values using Lithuanian locale settings.
 */
const dateTimeFormat = new Intl.DateTimeFormat("lt-LT", {
  dateStyle: "medium",
  timeStyle: "short",
});

/**
 * Converts an ISO date string into a localized date-time format.
 * Returns the original value if the date is invalid.
 */
function formatDateTime(value: string): string {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : dateTimeFormat.format(date);
}

/**
 * Displays a table of reservations with room, organizer,
 * schedule, participant count, status, and available actions.
 */
export function ReservationTable({
  reservations,
  rooms,
  users,
  loading,
  actionId,
  onCancel,
  onEndEarly,
}: ReservationTableProps) {
  // Create a lookup map for room names by room ID.
  const roomNames = useMemo(
    () => new Map(rooms.map((room) => [room.id, room.name])),
    [rooms]
  );

  // Create a lookup map for user full names by user ID.
  const userNames = useMemo(
    () =>
      new Map(
        users.map((user) => [
          user.id,
          `${user.name} ${user.surname}`,
        ])
      ),
    [users]
  );

  // Store the current timestamp to determine active reservations.
  const now = Date.now();

  return (
    <Paper variant="outlined">
      {/* Show a loading indicator while data is being fetched. */}
      {loading && <LinearProgress />}

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Room</TableCell>
              <TableCell>Organizer</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>End</TableCell>
              <TableCell align="right">
                Participant Count
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {/* Display a message when no reservations are available. */}
            {reservations.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={8}>
                  <Typography
                    color="text.secondary"
                    sx={{ py: 3, textAlign: "center" }}
                  >
                    No reservations found. Change filters or create
                    a new reservation.
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {/* Render each reservation as a table row. */}
            {reservations.map((reservation) => {
              const isBooked =
                reservation.status === ReservationStatus.Booked;

              const start = new Date(
                reservation.plannedStart
              ).getTime();

              const end = new Date(
                reservation.plannedEnd
              ).getTime();

              // Check whether the reservation is currently in progress.
              const inProgress =
                isBooked && start <= now && now < end;

              // Determine whether an action is currently being processed.
              const isBusy = actionId === reservation.id;

              return (
                <TableRow key={reservation.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {reservation.title}
                  </TableCell>

                  <TableCell>
                    {roomNames.get(reservation.roomId) ??
                      `Room #${reservation.roomId}`}
                  </TableCell>

                  <TableCell>
                    {userNames.get(reservation.organizerId) ??
                      `User #${reservation.organizerId}`}
                  </TableCell>

                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {formatDateTime(
                      reservation.plannedStart
                    )}
                  </TableCell>

                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {formatDateTime(
                      reservation.plannedEnd
                    )}
                  </TableCell>

                  <TableCell align="right">
                    {reservation.participantCount}
                  </TableCell>

                  <TableCell>
                    <ReservationStatusBadge
                      status={reservation.status}
                    />
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    {/* Allow ending active reservations early. */}
                    {inProgress && (
                      <Button
                        size="small"
                        onClick={() =>
                          onEndEarly(reservation)
                        }
                        disabled={isBusy}
                      >
                        End Early
                      </Button>
                    )}

                    {/* Allow cancelling booked reservations. */}
                    {isBooked && (
                      <Button
                        size="small"
                        color="error"
                        onClick={() =>
                          onCancel(reservation)
                        }
                        disabled={isBusy}
                      >
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default ReservationTable;