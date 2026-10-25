import Chip from "@mui/material/Chip";
import { RoomStatus, getStatusLabel } from "../../constants/RoomOptions";

interface RoomStatusBadgeProps {
  status: number;
}

export function RoomStatusBadge({ status }: RoomStatusBadgeProps) {
  const isActive = status === RoomStatus.Active;

  return (
    <Chip
      size="small"
      label={getStatusLabel(status)}
      color={isActive ? "success" : "default"}
      variant={isActive ? "filled" : "outlined"}
    />
  );
}

export default RoomStatusBadge;