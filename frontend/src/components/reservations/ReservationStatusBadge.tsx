import Chip from "@mui/material/Chip";
import {
  ReservationStatus,
  getReservationStatusLabel,
} from "../../constants/ReservationOptions";

interface ReservationStatusBadgeProps {
  status: number;
}

export function ReservationStatusBadge({
  status,
}: ReservationStatusBadgeProps) {
  const label = getReservationStatusLabel(status);

  switch (status) {
    case ReservationStatus.Booked:
      return <Chip size="small" label={label} color="primary" />;
    case ReservationStatus.Completed:
      return <Chip size="small" label={label} color="success" />;
    case ReservationStatus.Cancelled:
      return <Chip size="small" label={label} variant="outlined" />;
    default:
      return <Chip size="small" label={label} variant="outlined" />;
  }
}

export default ReservationStatusBadge;