import { useCallback, useEffect, useRef, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";
import { RoomFilters, EMPTY_FILTER_VALUES } from "../components/rooms/RoomFilters";
import type {
  RoomFilterErrors,
  RoomFilterValues,
} from "../components/rooms/RoomFilters";
import { RoomTable } from "../components/rooms/RoomTable";
import { ApiError } from "../services/apiClient";
import { roomService } from "../services/roomService";
import type { RoomDto } from "../types/room";

type RoomQueryParams = Parameters<typeof roomService.getFiltered>[0];

interface Notice {
  severity: "success" | "error";
  message: string;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.errorCode === "ROOM_NOT_FOUND") {
      return "Kambarys nerastas. Galbūt jis jau pašalintas.";
    }
    return error.message || "Serveris grąžino klaidą.";
  }

  // fetch() meta TypeError, kai serveris nepasiekiamas
  if (error instanceof TypeError) {
    return "Nepavyko pasiekti serverio. Patikrinkite, ar API veikia, ir bandykite dar kartą.";
  }

  return "Įvyko nežinoma klaida.";
}

/** undefined = tuščia, null = netinkama reikšmė, kitaip – sveikasis skaičius */
function parseOptionalInteger(value: string): number | undefined | null {
  const trimmed = value.trim();
  if (trimmed === "") {
    return undefined;
  }

  const parsed = Number(trimmed);
  return Number.isInteger(parsed) ? parsed : null;
}

export function RoomsPage() {
  const [rooms, setRooms] = useState<RoomDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [draftFilters, setDraftFilters] =
    useState<RoomFilterValues>(EMPTY_FILTER_VALUES);
  const [filterErrors, setFilterErrors] = useState<RoomFilterErrors>({});
  // Filtrai, kurie realiai išsiųsti į backend
  const [appliedFilters, setAppliedFilters] = useState<RoomQueryParams>({});

  const [notice, setNotice] = useState<Notice | null>(null);

  // Apsaugo nuo senesnio atsakymo, perrašančio naujesnį
  const requestIdRef = useRef(0);

  const loadRooms = useCallback(async (params: RoomQueryParams) => {
    const requestId = ++requestIdRef.current;

    setLoading(true);
    setLoadError(null);

    try {
      const data = await roomService.getFiltered(params);
      if (requestId !== requestIdRef.current) return;
      setRooms(data);
    } catch (error) {
      if (requestId !== requestIdRef.current) return;
      setRooms([]);
      setLoadError(getErrorMessage(error));
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  // Pirmas užkrovimas ir kiekvienas filtrų pakeitimas
  useEffect(() => {
    void loadRooms(appliedFilters);
  }, [appliedFilters, loadRooms]);

  const handleApplyFilters = () => {
    const errors: RoomFilterErrors = {};

    const minCapacity = parseOptionalInteger(draftFilters.minCapacity);
    if (minCapacity === null || (minCapacity !== undefined && minCapacity < 1)) {
      errors.minCapacity = "Įveskite sveikąjį skaičių nuo 1.";
    }

    const floor = parseOptionalInteger(draftFilters.floor);
    if (floor === null) {
      errors.floor = "Įveskite sveikąjį skaičių.";
    }

    const equipment = parseOptionalInteger(draftFilters.equipment);

    setFilterErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setAppliedFilters({
      minCapacity: minCapacity ?? undefined,
      floor: floor ?? undefined,
      equipment: equipment ?? undefined,
    });
  };

  const handleResetFilters = () => {
    setDraftFilters(EMPTY_FILTER_VALUES);
    setFilterErrors({});
    setAppliedFilters({});
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
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
          Kambariai
        </Typography>
      </Box>

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

      {loadError ? (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => void loadRooms(appliedFilters)}
            >
              Bandyti dar kartą
            </Button>
          }
        >
          {loadError}
        </Alert>
      ) : (
        <RoomTable
          rooms={rooms}
          loading={loading}
        />
      )}

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

export default RoomsPage;