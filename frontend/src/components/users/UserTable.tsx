import Box from "@mui/material/Box";
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
import type { UserDto } from "../../types/user";

/**
 * Props accepted by the UserTable component.
 */
interface UserTableProps {
  // List of users to display as table rows.
  users: UserDto[];
  // Indicates whether the user data is currently being loaded.
  loading: boolean;
}

/**
 * Renders a table of users with their names and active reservations,
 * including the number of active reservations and their IDs.
 */
export function UserTable({ users, loading }: UserTableProps) {
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
              <TableCell>Surname</TableCell>
              <TableCell align="right">Number of Active Reservations</TableCell>
              <TableCell>Active Reservations IDs</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {/* Display an empty state message when there are no users to show. */}
            {users.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography
                    color="text.secondary"
                    sx={{ py: 3, textAlign: "center" }}
                  >
                    Users not found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {/* Render one table row for each user. */}
            {users.map((user) => {
              // GET /api/users returns only the IDs of Booked reservations,
              // so their count equals the number of active reservations.
              // Sort the IDs in ascending order without mutating the original array.
              const reservationIds = [...user.reservationIds].sort(
                (a, b) => a - b
              );

              return (
                <TableRow key={user.id} hover>
                  {/* Display the user ID. */}
                  <TableCell>{user.id}</TableCell>

                  {/* Display the user's name and surname. */}
                  <TableCell sx={{ fontWeight: 500 }}>{user.name}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{user.surname}</TableCell>

                  {/* Display the number of active reservations. */}
                  <TableCell align="right">{reservationIds.length}</TableCell>

                  {/* Display the active reservation IDs as chips, or a dash if the user has none. */}
                  <TableCell>
                    {reservationIds.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        —
                      </Typography>
                    ) : (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {/* Render one chip for each reservation ID. */}
                        {reservationIds.map((id) => (
                          <Chip
                            key={id}
                            size="small"
                            variant="outlined"
                            label={`#${id}`}
                          />
                        ))}
                      </Box>
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

export default UserTable;