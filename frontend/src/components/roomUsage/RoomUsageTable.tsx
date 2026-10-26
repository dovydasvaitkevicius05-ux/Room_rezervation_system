import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import type { RoomUsageDto } from "../../types/roomUsage";

/**
 * Props accepted by the RoomUsageTable component.
 */
interface RoomUsageTableProps {
  // List of room usage statistics to display as table rows.
  rooms: RoomUsageDto[];
  // Indicates whether the usage data is currently being loaded.
  loading: boolean;
}

/**
 * Renders a table with usage statistics for each room, including its details,
 * status and the number of reservations and cancelled reservations.
 */
export function RoomUsageTable({ rooms, loading }: RoomUsageTableProps) {
  // Show a centered spinner instead of the table while data is loading.
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 4,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Display an empty state message when there is no usage data to show.
  if (rooms.length === 0) {
    return <Typography color="text.secondary">Data not found.</Typography>;
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        {/* Render the table column headers. */}
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Capacity</TableCell>
            <TableCell>Floor</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Reservations</TableCell>
            <TableCell align="right">Cancelled Reservations</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {/* Render one table row for each room. */}
          {rooms.map((room) => (
            <TableRow key={room.roomId} hover>
              {/* Display the room ID and name. */}
              <TableCell>{room.roomId}</TableCell>
              <TableCell>{room.roomName}</TableCell>

              {/* Display the room capacity, floor and location. */}
              <TableCell>{room.capacity}</TableCell>
              <TableCell>{room.floor}</TableCell>
              <TableCell>{room.location}</TableCell>

              {/* Display the room status as text (0 means active). */}
              <TableCell>{room.status === 0 ? "Active" : "Inactive"}</TableCell>

              {/* Display the total and cancelled reservation counts. */}
              <TableCell align="right">{room.reservationCount}</TableCell>
              <TableCell align="right">
                {room.cancelledReservationCount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default RoomUsageTable;