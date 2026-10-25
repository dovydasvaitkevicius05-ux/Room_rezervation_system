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

interface ReservationTableProps {
  reservations: ReservationDto[];
  rooms: RoomDto[];
  users: UserDto[];
  loading: boolean;
  /** Rezervacijos, kuriai šiuo metu vykdomas veiksmas, ID */
  actionId: number | null;
  onCancel: (reservation: ReservationDto) => void;
  onEndEarly: (reservation: ReservationDto) => void;
}

const dateTimeFormat = new Intl.DateTimeFormat("lt-LT", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDateTime(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : dateTimeFormat.format(date);
}

export function ReservationTable({
  reservations,
  rooms,
  users,
  loading,
  actionId,
  onCancel,
  onEndEarly,
}: ReservationTableProps) {
  const roomNames = useMemo(
    () => new Map(rooms.map((room) => [room.id, room.name])),
    [rooms]
  );

  const userNames = useMemo(
    () => new Map(users.map((user) => [user.id, `${user.name} ${user.surname}`])),
    [users]
  );

  const now = Date.now();

  return (
    <Paper variant="outlined">
      {loading && <LinearProgress />}

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Pavadinimas</TableCell>
              <TableCell>Kambarys</TableCell>
              <TableCell>Organizatorius</TableCell>
              <TableCell>Pradžia</TableCell>
              <TableCell>Pabaiga</TableCell>
              <TableCell align="right">Dalyvių sk.</TableCell>
              <TableCell>Būsena</TableCell>
              <TableCell align="right">Veiksmai</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {reservations.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={8}>
                  <Typography
                    color="text.secondary"
                    sx={{ py: 3, textAlign: "center" }}
                  >
                    Rezervacijų nerasta. Pakeiskite filtrus arba sukurkite naują
                    rezervaciją.
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {reservations.map((reservation) => {
              const isBooked = reservation.status === ReservationStatus.Booked;
              const start = new Date(reservation.plannedStart).getTime();
              const end = new Date(reservation.plannedEnd).getTime();
              const inProgress = isBooked && start <= now && now < end;
              const isBusy = actionId === reservation.id;

              return (
                <TableRow key={reservation.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {reservation.title}
                  </TableCell>
                  <TableCell>
                    {roomNames.get(reservation.roomId) ??
                      `Kambarys #${reservation.roomId}`}
                  </TableCell>
                  <TableCell>
                    {userNames.get(reservation.organizerId) ??
                      `Vartotojas #${reservation.organizerId}`}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {formatDateTime(reservation.plannedStart)}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {formatDateTime(reservation.plannedEnd)}
                  </TableCell>
                  <TableCell align="right">
                    {reservation.participantCount}
                  </TableCell>
                  <TableCell>
                    <ReservationStatusBadge status={reservation.status} />
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    {inProgress && (
                      <Button
                        size="small"
                        onClick={() => onEndEarly(reservation)}
                        disabled={isBusy}
                      >
                        Baigti anksčiau
                      </Button>
                    )}
                    {isBooked && (
                      <Button
                        size="small"
                        color="error"
                        onClick={() => onCancel(reservation)}
                        disabled={isBusy}
                      >
                        Atšaukti
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