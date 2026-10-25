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

interface UserTableProps {
  users: UserDto[];
  loading: boolean;
}

export function UserTable({ users, loading }: UserTableProps) {
  return (
    <Paper variant="outlined">
      {loading && <LinearProgress />}

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Vardas</TableCell>
              <TableCell>Pavardė</TableCell>
              <TableCell align="right">Aktyvių rezervacijų skaičius</TableCell>
              <TableCell>Aktyvių rezervacijų ID</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography
                    color="text.secondary"
                    sx={{ py: 3, textAlign: "center" }}
                  >
                    Vartotojų nerasta.
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {users.map((user) => {
              // GET /api/users grąžina tik Booked rezervacijų ID,
              // todėl jų kiekis yra aktyvių rezervacijų skaičius.
              const reservationIds = [...user.reservationIds].sort(
                (a, b) => a - b
              );

              return (
                <TableRow key={user.id} hover>
                  <TableCell>{user.id}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{user.name}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{user.surname}</TableCell>
                  <TableCell align="right">{reservationIds.length}</TableCell>
                  <TableCell>
                    {reservationIds.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        —
                      </Typography>
                    ) : (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
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