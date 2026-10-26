import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { getEquipmentLabel } from "../../constants/RoomOptions";
import type { RoomDto } from "../../types/room";
import { RoomStatusBadge } from "./RoomStatusBadge";

/**
 * Props accepted by the RoomTable component.
 */
interface RoomTableProps {
  // List of rooms to display as table rows.
  rooms: RoomDto[];
  // Indicates whether the room data is currently being loaded.
  loading: boolean;
  // Called when the user requests to view the timeline of a room.
  onViewTimeline: (room: RoomDto) => void;
}

/**
 * Renders a table of rooms with their capacity, floor, equipment, status
 * and an action button for viewing the room timeline.
 */
export function RoomTable({ rooms, loading, onViewTimeline }: RoomTableProps) {
  return (
    <Paper variant="outlined">
      {/* Show a progress bar at the top of the table while data is loading. */}
      {loading && <LinearProgress />}

      <TableContainer>
        <Table size="small">
          {/* Render the table column headers. */}
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Capacity</TableCell>
              <TableCell align="right">Floor</TableCell>
              <TableCell>Equipment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {/* Display an empty state message when there are no rooms to show. */}
            {rooms.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography
                    color="text.secondary"
                    sx={{ py: 3, textAlign: "center" }}
                  >
                    Rooms not found. Please adjust the filters.
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {/* Render one table row for each room. */}
            {rooms.map((room) => {
              return (
                <TableRow key={room.id} hover>
                  {/* Display the room ID. */}
                  <TableCell>{room.id}</TableCell>

                  {/* Display the room name. */}
                  <TableCell sx={{ fontWeight: 500 }}>{room.name}</TableCell>

                  {/* Display the room capacity and floor number. */}
                  <TableCell align="right">{room.capacity}</TableCell>
                  <TableCell align="right">{room.floor}</TableCell>

                  {/* Display the room equipment as chips, or a dash if the room has none. */}
                  <TableCell>
                    {room.equipment.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        —
                      </Typography>
                    ) : (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {/* Render one chip for each piece of equipment. */}
                        {room.equipment.map((item) => (
                          <Chip
                            key={item}
                            size="small"
                            variant="outlined"
                            label={getEquipmentLabel(item)}
                          />
                        ))}
                      </Box>
                    )}
                  </TableCell>

                  {/* Display the room status as a badge. */}
                  <TableCell>
                    <RoomStatusBadge status={room.status} />
                  </TableCell>

                  {/* Render the button for opening the room timeline. */}
                  <TableCell>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => onViewTimeline(room)}
                    >
                      View Timeline
                    </Button>
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

export default RoomTable;