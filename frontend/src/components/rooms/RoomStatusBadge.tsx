import Chip from "@mui/material/Chip";
import { RoomStatus, getStatusLabel } from "../../constants/RoomOptions";

/**
 * Props accepted by the RoomStatusBadge component.
 */
interface RoomStatusBadgeProps {
  // Numeric room status code, matching the values of RoomStatus.
  status: number;
}

/**
 * Renders a small badge showing the room status.
 * Active rooms are highlighted in green, other statuses use a neutral outlined style.
 */
export function RoomStatusBadge({ status }: RoomStatusBadgeProps) {
  // Determine whether the room is currently active to choose the badge appearance.
  const isActive = status === RoomStatus.Active;

  return (
    // Display the human-readable status label inside the badge.
    <Chip
      size="small"
      label={getStatusLabel(status)}
      color={isActive ? "success" : "default"}
      variant={isActive ? "filled" : "outlined"}
    />
  );
}

export default RoomStatusBadge;