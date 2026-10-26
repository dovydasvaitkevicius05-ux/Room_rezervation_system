import { useCallback, useEffect, useRef, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";
import {
  EMPTY_RESERVATION_FILTER_VALUES,
  ReservationFilters,
} from "../components/reservations/ReservationFilters";
import type {
  ReservationFilterErrors,
  ReservationFilterValues,
} from "../components/reservations/ReservationFilters";
import { ReservationForm } from "../components/reservations/ReservationForm";
import { ReservationTable } from "../components/reservations/ReservationTable";
import { ApiError } from "../services/apiClient";
import { reservationService } from "../services/ReservationService";
import { roomService } from "../services/roomService";
import { userService } from "../services/userService";
import type {
  CreateReservationDto,
  ReservationDto,
} from "../types/reservation";
import type { RoomDto } from "../types/room";
import type { UserDto } from "../types/user";

// Derive the query parameters type from the reservation service filter method.
type ReservationQueryParams = Parameters<
  typeof reservationService.getFiltered
>[0];

/**
 * Describes a notification shown to the user in the snackbar.
 */
interface Notice {
  // Determines the color and icon of the notification.
  severity: "success" | "error";
  // Text displayed inside the notification.
  message: string;
}

/**
 * Describes an action waiting for the user's confirmation in the dialog.
 */
interface PendingAction {
  // Type of the action: cancel the reservation or end the meeting early.
  type: "cancel" | "endEarly";
  // Reservation the action will be applied to.
  reservation: ReservationDto;
}

// Map backend error codes to user-friendly messages.
const ERROR_MESSAGES: Record<string, string> = {
  INVALID_DATE_RANGE: "The start date cannot be later than the end date.",
  INVALID_START_TIME: "The reservation start time must be in the future.",
  INVALID_END_TIME: "The reservation end time must be later than the start time.",
  ROOM_NOT_FOUND: "The selected room could not be found.",
  USER_NOT_FOUND: "The selected organizer could not be found.",
  ROOM_INACTIVE: "Inactive rooms cannot be reserved.",
  ROOM_BOOKING_CONFLICT: "The room is already reserved for this time.",
  ORGANIZER_BOOKING_CONFLICT:
    "The organizer already has another meeting at this time.",
  INVALID_STATUS: "The status of this reservation can no longer be changed.",
  RESERVATION_NOT_IN_PROGRESS:
    "Only a meeting that is currently in progress can be ended early.",
};

/**
 * Converts an unknown error into a message that can be shown to the user.
 * Handles API errors, network errors and any other unexpected errors.
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    // Prefer a friendly message for known backend error codes.
    const known = ERROR_MESSAGES[error.errorCode];
    if (known) {
      return known;
    }

    // Handle the case when the reservation no longer exists on the server.
    if (error.status === 404 && error.errorCode === "UNKNOWN_ERROR") {
      return "Reservation not found. It may have already been deleted.";
    }

    return error.message || "The server returned an error.";
  }

  // A TypeError from fetch usually means the server could not be reached.
  if (error instanceof TypeError) {
    return "Unable to reach the server. Check whether the API is running and try again.";
  }

  return "An unexpected error occurred.";
}

/**
 * Converts a form input value to a number.
 * Returns undefined for an empty string so the filter is not applied.
 */
function toOptionalNumber(value: string): number | undefined {
  return value === "" ? undefined : Number(value);
}

/**
 * Renders the reservations page with filters, a reservation table,
 * a creation form and confirmation dialogs for cancelling or ending
 * meetings early. Also handles loading data and showing notifications.
 */
export function ReservationsPage() {
  // Store the data displayed on the page: reservations and lookup lists.
  const [reservations, setReservations] = useState<ReservationDto[]>([]);
  const [rooms, setRooms] = useState<RoomDto[]>([]);
  const [users, setUsers] = useState<UserDto[]>([]);

  // Track the loading state and errors for the reservations and lookup data.
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  // Keep the filter values being edited separately from the ones already applied.
  const [draftFilters, setDraftFilters] = useState<ReservationFilterValues>(
    EMPTY_RESERVATION_FILTER_VALUES
  );
  const [filterErrors, setFilterErrors] = useState<ReservationFilterErrors>({});
  const [appliedFilters, setAppliedFilters] = useState<ReservationQueryParams>(
    {}
  );

  // Track the state of the reservation creation form.
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Track the action awaiting confirmation, the reservation being processed and the notification.
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null
  );
  const [actionId, setActionId] = useState<number | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  // Store the ID of the latest request to ignore outdated responses.
  const requestIdRef = useRef(0);

  // Load reservations from the API using the given filters.
  const loadReservations = useCallback(
    async (params: ReservationQueryParams) => {
      // Mark this request as the latest one.
      const requestId = ++requestIdRef.current;

      setLoading(true);
      setLoadError(null);

      try {
        const data = await reservationService.getFiltered(params);
        // Ignore the response if a newer request has been started.
        if (requestId !== requestIdRef.current) return;
        setReservations(data);
      } catch (error) {
        if (requestId !== requestIdRef.current) return;
        setReservations([]);
        setLoadError(getErrorMessage(error));
      } finally {
        // Hide the loading indicator only if this is still the latest request.
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    []
  );

  // Load the rooms and users used for filters, the form and name lookups.
  const loadLookups = useCallback(async () => {
    setLookupError(null);

    try {
      // Fetch rooms and users in parallel to reduce loading time.
      const [roomsData, usersData] = await Promise.all([
        roomService.getAll(),
        userService.getAll(),
      ]);
      setRooms(roomsData);
      setUsers(usersData);
    } catch (error) {
      setLookupError(getErrorMessage(error));
    }
  }, []);

  // Load the lookup data once when the page is opened.
  useEffect(() => {
    void loadLookups();
  }, [loadLookups]);

  // Reload the reservations whenever the applied filters change.
  useEffect(() => {
    void loadReservations(appliedFilters);
  }, [appliedFilters, loadReservations]);

  // Retry loading all data after a failure.
  const handleRetry = () => {
    void loadLookups();
    void loadReservations(appliedFilters);
  };

  // Validate the draft filters and apply them if they are valid.
  const handleApplyFilters = () => {
    const errors: ReservationFilterErrors = {};

    // Make sure the start date is not later than the end date.
    if (
      draftFilters.from !== "" &&
      draftFilters.to !== "" &&
      draftFilters.from > draftFilters.to
    ) {
      errors.to = "The end date cannot be earlier than the start date.";
    }

    setFilterErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    // Convert the form values to query parameters, covering whole days for the date range.
    setAppliedFilters({
      roomId: toOptionalNumber(draftFilters.roomId),
      organizerId: toOptionalNumber(draftFilters.organizerId),
      status: toOptionalNumber(draftFilters.status),
      from: draftFilters.from ? `${draftFilters.from}T00:00:00` : undefined,
      to: draftFilters.to ? `${draftFilters.to}T23:59:59` : undefined,
    });
  };

  // Clear both the draft and applied filters.
  const handleResetFilters = () => {
    setDraftFilters(EMPTY_RESERVATION_FILTER_VALUES);
    setFilterErrors({});
    setAppliedFilters({});
  };

  // Open the reservation creation form with no previous error.
  const handleCreateClick = () => {
    setFormError(null);
    setFormOpen(true);
  };

  // Create a new reservation and refresh the table on success.
  const handleFormSubmit = async (dto: CreateReservationDto) => {
    setSubmitting(true);
    setFormError(null);

    try {
      await reservationService.create(dto);

      // Close the form and notify the user about the success.
      setFormOpen(false);
      setNotice({
        severity: "success",
        message: "Reservation created successfully.",
      });

      await loadReservations(appliedFilters);
    } catch (error) {
      // Keep the form open and show the error inside it.
      setFormError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  // Perform the confirmed action (cancel or end early) and refresh the table.
  const handleConfirmAction = async () => {
    if (!pendingAction) return;

    const { type, reservation } = pendingAction;

    // Close the confirmation dialog and mark the reservation as busy.
    setPendingAction(null);
    setActionId(reservation.id);

    try {
      if (type === "cancel") {
        await reservationService.cancel(reservation.id);
      } else {
        await reservationService.endEarly(reservation.id);
      }

      setNotice({
        severity: "success",
        message:
          type === "cancel"
            ? `Reservation "${reservation.title}" has been canceled.`
            : `Meeting "${reservation.title}" has been ended early.`,
      });

      await loadReservations(appliedFilters);
    } catch (error) {
      setNotice({ severity: "error", message: getErrorMessage(error) });
    } finally {
      setActionId(null);
    }
  };

  // Combine errors that prevent the page from displaying its data.
  const fatalError = loadError ?? lookupError;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Render the page header with the title and the button for creating a reservation. */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Reservations
        </Typography>
        <Button variant="contained" onClick={handleCreateClick}>
          New Reservation
        </Button>
      </Box>

      {/* Render the filters for narrowing down the reservation list. */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <ReservationFilters
          values={draftFilters}
          errors={filterErrors}
          rooms={rooms}
          users={users}
          disabled={loading}
          onChange={setDraftFilters}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />
      </Paper>

      {/* Show an error with a retry button, or the reservation table if loading succeeded. */}
      {fatalError ? (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={handleRetry}>
              Try Again
            </Button>
          }
        >
          {fatalError}
        </Alert>
      ) : (
        <ReservationTable
          reservations={reservations}
          rooms={rooms}
          users={users}
          loading={loading}
          actionId={actionId}
          onCancel={(reservation) =>
            setPendingAction({ type: "cancel", reservation })
          }
          onEndEarly={(reservation) =>
            setPendingAction({ type: "endEarly", reservation })
          }
        />
      )}

      {/* Render the dialog form for creating a new reservation. */}
      <ReservationForm
        open={formOpen}
        rooms={rooms}
        users={users}
        submitting={submitting}
        error={formError}
        onSubmit={(dto) => void handleFormSubmit(dto)}
        onCancel={() => setFormOpen(false)}
      />

      {/* Render the confirmation dialog for cancelling or ending a reservation early. */}
      <Dialog
        open={pendingAction !== null}
        onClose={() => setPendingAction(null)}
      >
        <DialogTitle>
          {pendingAction?.type === "cancel"
            ? "Cancel Reservation?"
            : "End Meeting Early?"}
        </DialogTitle>
        <DialogContent>
          {/* Describe the consequences of the selected action. */}
          <DialogContentText>
            {pendingAction?.type === "cancel"
              ? `Reservation "${pendingAction.reservation.title}" will be canceled. This action cannot be undone.`
              : pendingAction
                ? `The end time of meeting "${pendingAction.reservation.title}" will be set to the current time, and the reservation will be marked as completed.`
                : ""}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setPendingAction(null)}>No</Button>
          <Button
            variant="contained"
            color={pendingAction?.type === "cancel" ? "error" : "primary"}
            onClick={() => void handleConfirmAction()}
          >
            {pendingAction?.type === "cancel"
              ? "Cancel Reservation"
              : "End Early"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Show a temporary notification about the result of an action. */}
      <Snackbar
        open={notice !== null}
        autoHideDuration={4000}
        onClose={() => setNotice(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {notice ? (
          <Alert
            severity={notice.severity}
            variant="filled"
            onClose={() => setNotice(null)}
          >
            {notice.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Container>
  );
}

export default ReservationsPage;