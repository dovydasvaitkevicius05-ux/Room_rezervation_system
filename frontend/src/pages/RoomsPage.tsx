import { useCallback, useEffect, useRef, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";
import {
  EMPTY_FILTER_VALUES,
  RoomFilters,
} from "../components/rooms/RoomFilters";
import type {
  RoomFilterErrors,
  RoomFilterValues,
} from "../components/rooms/RoomFilters";
import { RoomTable } from "../components/rooms/RoomTable";
import RoomTimelineDialog from "../components/rooms/RoomTimelineDialog";
import { ApiError } from "../services/apiClient";
import { roomService } from "../services/roomService";
import type { RoomDto } from "../types/room";

// Derive the query parameters type from the room service filter method.
type RoomQueryParams = Parameters<typeof roomService.getFiltered>[0];

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
 * Converts an unknown error into a message that can be shown to the user.
 * Handles API errors, network errors and any other unexpected errors.
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    // Show a friendly message when the room no longer exists on the server.
    if (error.errorCode === "ROOM_NOT_FOUND") {
      return "Room not found. It may have already been deleted.";
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
 * Parses a form input value as an optional integer.
 * Returns undefined for empty input, null for invalid input, or an integer.
 */
function parseOptionalInteger(value: string): number | undefined | null {
  const trimmed = value.trim();
  if (trimmed === "") {
    return undefined;
  }

  const parsed = Number(trimmed);
  return Number.isInteger(parsed) ? parsed : null;
}

/**
 * Renders the rooms page with filters, a room table and a dialog
 * showing the weekly timeline of the selected room.
 * Also handles loading data and showing notifications.
 */
export function RoomsPage() {
  // Store the rooms displayed on the page and track the loading state and error.
  const [rooms, setRooms] = useState<RoomDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Keep the filter values being edited separately from the ones already applied.
  const [draftFilters, setDraftFilters] =
    useState<RoomFilterValues>(EMPTY_FILTER_VALUES);
  const [filterErrors, setFilterErrors] = useState<RoomFilterErrors>({});
  const [appliedFilters, setAppliedFilters] = useState<RoomQueryParams>({});

  // Track the notification shown to the user.
  const [notice, setNotice] = useState<Notice | null>(null);

  // Track the room whose timeline is displayed in the dialog.
  const [selectedRoom, setSelectedRoom] = useState<RoomDto | null>(null);

  // Store the ID of the latest request to ignore outdated responses.
  const requestIdRef = useRef(0);

  // Load rooms from the API using the given filters.
  const loadRooms = useCallback(async (params: RoomQueryParams) => {
    // Mark this request as the latest one.
    const requestId = ++requestIdRef.current;

    setLoading(true);
    setLoadError(null);

    try {
      const data = await roomService.getFiltered(params);
      // Ignore the response if a newer request has been started.
      if (requestId !== requestIdRef.current) return;
      setRooms(data);
    } catch (error) {
      if (requestId !== requestIdRef.current) return;
      setRooms([]);
      setLoadError(getErrorMessage(error));
    } finally {
      // Hide the loading indicator only if this is still the latest request.
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  // Reload the rooms whenever the applied filters change.
  useEffect(() => {
    void loadRooms(appliedFilters);
  }, [appliedFilters, loadRooms]);

  // Validate the draft filters and apply them if they are valid.
  const handleApplyFilters = () => {
    const errors: RoomFilterErrors = {};

    // Minimum capacity must be an integer greater than or equal to 1.
    const minCapacity = parseOptionalInteger(draftFilters.minCapacity);
    if (
      minCapacity === null ||
      (minCapacity !== undefined && minCapacity < 1)
    ) {
      errors.minCapacity = "Enter an integer greater than or equal to 1.";
    }

    // Floor must be an integer.
    const floor = parseOptionalInteger(draftFilters.floor);
    if (floor === null) {
      errors.floor = "Enter an integer.";
    }

    // Equipment comes from a dropdown, so it needs no validation.
    const equipment = parseOptionalInteger(draftFilters.equipment);

    setFilterErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    // Convert the form values to query parameters.
    setAppliedFilters({
      minCapacity: minCapacity ?? undefined,
      floor: floor ?? undefined,
      equipment: equipment ?? undefined,
    });
  };

  // Clear both the draft and applied filters.
  const handleResetFilters = () => {
    setDraftFilters(EMPTY_FILTER_VALUES);
    setFilterErrors({});
    setAppliedFilters({});
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Render the page header with the title. */}
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
          Rooms
        </Typography>
      </Box>

      {/* Render the filters for narrowing down the room list. */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <RoomFilters
          values={draftFilters}
          errors={filterErrors}
          disabled={loading}
          onChange={setDraftFilters}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />
      </Paper>

      {/* Show an error with a retry button, or the room table if loading succeeded. */}
      {loadError ? (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => void loadRooms(appliedFilters)}
            >
              Try Again
            </Button>
          }
        >
          {loadError}
        </Alert>
      ) : (
        <RoomTable
          rooms={rooms}
          loading={loading}
          onViewTimeline={setSelectedRoom}
        />
      )}

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

      {/* Render the dialog with the weekly timeline of the selected room. */}
      <RoomTimelineDialog
        open={selectedRoom !== null}
        roomId={selectedRoom?.id ?? null}
        roomName={selectedRoom?.name ?? ""}
        onClose={() => setSelectedRoom(null)}
      />
    </Container>
  );
}

export default RoomsPage;