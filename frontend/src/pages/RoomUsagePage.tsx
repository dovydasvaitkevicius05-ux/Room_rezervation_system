import { useCallback, useEffect, useRef, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { RoomUsageTable } from "../components/roomUsage/RoomUsageTable";
import { ApiError } from "../services/apiClient";
import { roomUsageService } from "../services/roomUsageService";
import type { RoomUsageDto } from "../types/roomUsage";

/**
 * Converts an unknown error into a message that can be shown to the user.
 * Handles API errors, network errors and any other unexpected errors.
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message || "The server returned an error.";
  }

  // A TypeError from fetch usually means the server could not be reached.
  if (error instanceof TypeError) {
    return "Unable to reach the server. Check whether the API is running and try again.";
  }

  return "An unexpected error occurred.";
}

/**
 * Generates a PDF report with a table of room usage statistics
 * and downloads it with the given file name.
 */
function exportPdf(title: string, fileName: string, rooms: RoomUsageDto[]) {
  const doc = new jsPDF();

  // Add the report title at the top of the page.
  doc.setFontSize(18);
  doc.text(title, 14, 20);

  // Add the generation date and time below the title.
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

  // Render the room usage data as a table below the header.
  autoTable(doc, {
    startY: 40,
    head: [
      [
        "ID",
        "Name",
        "Capacity",
        "Floor",
        "Location",
        "Status",
        "Reservations",
        "Cancelled",
      ],
    ],
    body: rooms.map((room) => [
      room.roomId,
      room.roomName,
      room.capacity,
      room.floor,
      room.location,
      // Status 0 means the room is active.
      room.status === 0 ? "Active" : "Inactive",
      room.reservationCount,
      room.cancelledReservationCount,
    ]),
  });

  // Download the generated PDF file.
  doc.save(fileName);
}

/**
 * Renders the room usage statistics page with two tables: the most popular
 * rooms and the rooms with the most canceled reservations. Each table can
 * be exported as a PDF report. Also handles loading data and errors.
 */
export function RoomUsagePage() {
  // Store the statistics displayed on the page.
  const [mostPopularRooms, setMostPopularRooms] = useState<RoomUsageDto[]>([]);
  const [mostCanceledRooms, setMostCanceledRooms] = useState<RoomUsageDto[]>(
    []
  );

  // Track the loading state and error for the statistics.
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Store the ID of the latest request to ignore outdated responses.
  const requestIdRef = useRef(0);

  // Load both statistics lists from the API.
  const loadData = useCallback(async () => {
    // Mark this request as the latest one.
    const requestId = ++requestIdRef.current;

    setLoading(true);
    setLoadError(null);

    try {
      // Fetch both lists in parallel to reduce loading time.
      const [popularRooms, canceledRooms] = await Promise.all([
        roomUsageService.getMostPopularRooms(),
        roomUsageService.getMostCanceledRooms(),
      ]);

      // Ignore the response if a newer request has been started.
      if (requestId !== requestIdRef.current) {
        return;
      }

      setMostPopularRooms(popularRooms);
      setMostCanceledRooms(canceledRooms);
    } catch (error) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setMostPopularRooms([]);
      setMostCanceledRooms([]);
      setLoadError(getErrorMessage(error));
    } finally {
      // Hide the loading indicator only if this is still the latest request.
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  // Load the statistics once when the page is opened.
  useEffect(() => {
    void loadData();
  }, [loadData]);

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
          Room Usage Statistics
        </Typography>
      </Box>

      {/* Show an error with a retry button, or the statistics if loading succeeded. */}
      {loadError ? (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => void loadData()}
            >
              Try Again
            </Button>
          }
        >
          {loadError}
        </Alert>
      ) : (
        <>
          {/* Render the table of the most popular rooms with its export button. */}
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Most Popular Rooms
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() =>
                exportPdf(
                  "Most Popular Rooms Report",
                  "most-popular-rooms-report.pdf",
                  mostPopularRooms
                )
              }
            >
              Export PDF
            </Button>

            <RoomUsageTable rooms={mostPopularRooms} loading={loading} />
          </Paper>

          {/* Render the table of rooms with the most canceled reservations with its export button. */}
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Rooms with the Most Canceled Reservations
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() =>
                exportPdf(
                  "Most Canceled Rooms Report",
                  "most-canceled-rooms-report.pdf",
                  mostCanceledRooms
                )
              }
            >
              Export PDF
            </Button>

            <RoomUsageTable rooms={mostCanceledRooms} loading={loading} />
          </Paper>
        </>
      )}
    </Container>
  );
}

export default RoomUsagePage;