import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { getEquipmentLabel } from "../../constants/RoomOptions";
import type { RoomDto } from "../../types/room";
import { RoomStatusBadge } from "./RoomStatusBadge";

interface RoomTableProps {
  rooms: RoomDto[];
  loading: boolean;
}

export function RoomTable({ rooms, loading }: RoomTableProps) {
  return (
    <Paper variant="outlined">
      {loading && <LinearProgress />}

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Pavadinimas</TableCell>
              <TableCell align="right">Talpa</TableCell>
              <TableCell align="right">Aukštas</TableCell>
              <TableCell>Vieta</TableCell>
              <TableCell>Įranga</TableCell>
              <TableCell>Būsena</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rooms.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography
                    color="text.secondary"
                    sx={{ py: 3, textAlign: "center" }}
                  >
                    Kambarių nerasta. Pakeiskite filtrus.
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {rooms.map((room) => {
              return (
                <TableRow key={room.id} hover>
                  <TableCell>{room.id}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{room.name}</TableCell>
                  <TableCell align="right">{room.capacity}</TableCell>
                  <TableCell align="right">{room.floor}</TableCell>
                  <TableCell>{room.location}</TableCell>
                  <TableCell>
                    {room.equipment.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        —
                      </Typography>
                    ) : (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
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
                  <TableCell>
                    <RoomStatusBadge status={room.status} />
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