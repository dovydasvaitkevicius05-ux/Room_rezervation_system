import Chip from "@mui/material/Chip";
import {
  ReservationStatus,
  getReservationStatusLabel,
} from "../../constants/ReservationOptions";

interface ReservationStatusBadgeProps {
  status: number;
}

/**
 * Displays a reservation status as a colored badge.
 * The badge appearance depends on the current reservation status.
 */
export function ReservationStatusBadge({
  status,
}: ReservationStatusBadgeProps) {
  // Get the display label for the given reservation status.
  const label = getReservationStatusLabel(status);

  // Use a different visual style for each reservation status.
  switch (status) {
    case ReservationStatus.Booked:
      return <Chip size="small" label={label} color="primary" />;

    case ReservationStatus.Completed:
      return <Chip size="small" label={label} color="success" />;

    case ReservationStatus.Cancelled:
      return <Chip size="small" label={label} variant="outlined" />;

    default:
      // Use the outlined style for unknown or unsupported statuses.
      return <Chip size="small" label={label} variant="outlined" />;
  }
}

export default ReservationStatusBadge;