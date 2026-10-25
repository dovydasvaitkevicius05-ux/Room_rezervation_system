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
import { reservationService } from "../services/reservationService";
import { roomService } from "../services/roomService";
import { userService } from "../services/userService";
import type {
  CreateReservationDto,
  ReservationDto,
} from "../types/reservation";
import type { RoomDto } from "../types/room";
import type { UserDto } from "../types/user";

type ReservationQueryParams = Parameters<
  typeof reservationService.getFiltered
>[0];

interface Notice {
  severity: "success" | "error";
  message: string;
}

interface PendingAction {
  type: "cancel" | "endEarly";
  reservation: ReservationDto;
}

// Backend klaidų kodai -> lietuviški pranešimai.
// Kodai su dinaminiais skaičiais (MAX_DURATION_EXCEEDED, BOOKING_HORIZON_EXCEEDED,
// ROOM_CAPACITY_EXCEEDED) rodomi tokie, kokius grąžina serveris.
const ERROR_MESSAGES: Record<string, string> = {
  INVALID_DATE_RANGE: "Pradžios data negali būti vėlesnė už pabaigos datą.",
  INVALID_START_TIME: "Rezervacijos pradžia turi būti ateityje.",
  INVALID_END_TIME: "Rezervacijos pabaiga turi būti vėlesnė už pradžią.",
  ROOM_NOT_FOUND: "Pasirinktas kambarys nerastas.",
  USER_NOT_FOUND: "Pasirinktas organizatorius nerastas.",
  ROOM_INACTIVE: "Neaktyvaus kambario rezervuoti negalima.",
  ROOM_BOOKING_CONFLICT: "Šiuo metu kambarys jau rezervuotas.",
  ORGANIZER_BOOKING_CONFLICT:
    "Organizatorius šiuo metu jau turi kitą susitikimą.",
  INVALID_STATUS: "Šios rezervacijos būsenos pakeisti nebegalima.",
  RESERVATION_NOT_IN_PROGRESS:
    "Anksčiau baigti galima tik šiuo metu vykstantį susitikimą.",
};

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const known = ERROR_MESSAGES[error.errorCode];
    if (known) {
      return known;
    }

    // Kai kurie backend metodai grąžina NotFound() be turinio
    if (error.status === 404 && error.errorCode === "UNKNOWN_ERROR") {
      return "Rezervacija nerasta. Galbūt ji jau pašalinta.";
    }

    return error.message || "Serveris grąžino klaidą.";
  }

  // fetch() meta TypeError, kai serveris nepasiekiamas
  if (error instanceof TypeError) {
    return "Nepavyko pasiekti serverio. Patikrinkite, ar API veikia, ir bandykite dar kartą.";
  }

  return "Įvyko nežinoma klaida.";
}

function toOptionalNumber(value: string): number | undefined {
  return value === "" ? undefined : Number(value);
}

export function ReservationsPage() {
  const [reservations, setReservations] = useState<ReservationDto[]>([]);
  const [rooms, setRooms] = useState<RoomDto[]>([]);
  const [users, setUsers] = useState<UserDto[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const [draftFilters, setDraftFilters] = useState<ReservationFilterValues>(
    EMPTY_RESERVATION_FILTER_VALUES
  );
  const [filterErrors, setFilterErrors] = useState<ReservationFilterErrors>({});
  // Filtrai, kurie realiai išsiųsti į backend
  const [appliedFilters, setAppliedFilters] = useState<ReservationQueryParams>(
    {}
  );

  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null
  );
  const [actionId, setActionId] = useState<number | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  // Apsaugo nuo senesnio atsakymo, perrašančio naujesnį
  const requestIdRef = useRef(0);

  const loadReservations = useCallback(
    async (params: ReservationQueryParams) => {
      const requestId = ++requestIdRef.current;

      setLoading(true);
      setLoadError(null);

      try {
        const data = await reservationService.getFiltered(params);
        if (requestId !== requestIdRef.current) return;
        setReservations(data);
      } catch (error) {
        if (requestId !== requestIdRef.current) return;
        setReservations([]);
        setLoadError(getErrorMessage(error));
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    []
  );

  // Kambariai ir vartotojai reikalingi filtrams, formai ir vardų rodymui lentelėje
  const loadLookups = useCallback(async () => {
    setLookupError(null);

    try {
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

  useEffect(() => {
    void loadLookups();
  }, [loadLookups]);

  // Pirmas užkrovimas ir kiekvienas filtrų pakeitimas
  useEffect(() => {
    void loadReservations(appliedFilters);
  }, [appliedFilters, loadReservations]);

  const handleRetry = () => {
    void loadLookups();
    void loadReservations(appliedFilters);
  };

  const handleApplyFilters = () => {
    const errors: ReservationFilterErrors = {};

    // YYYY-MM-DD formatą galima palyginti kaip tekstą
    if (
      draftFilters.from !== "" &&
      draftFilters.to !== "" &&
      draftFilters.from > draftFilters.to
    ) {
      errors.to = "Pabaigos data negali būti ankstesnė už pradžios datą.";
    }

    setFilterErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setAppliedFilters({
      roomId: toOptionalNumber(draftFilters.roomId),
      organizerId: toOptionalNumber(draftFilters.organizerId),
      status: toOptionalNumber(draftFilters.status),
      // Backend From/To yra imtinai ir laiko dalis svarbi,
      // todėl pasirinktą dieną paverčiame viso dienos intervalu
      from: draftFilters.from ? `${draftFilters.from}T00:00:00` : undefined,
      to: draftFilters.to ? `${draftFilters.to}T23:59:59` : undefined,
    });
  };

  const handleResetFilters = () => {
    setDraftFilters(EMPTY_RESERVATION_FILTER_VALUES);
    setFilterErrors({});
    setAppliedFilters({});
  };

  const handleCreateClick = () => {
    setFormError(null);
    setFormOpen(true);
  };

  const handleFormSubmit = async (dto: CreateReservationDto) => {
    setSubmitting(true);
    setFormError(null);

    try {
      await reservationService.create(dto);

      setFormOpen(false);
      setNotice({ severity: "success", message: "Rezervacija sukurta." });

      // POST grąžina entity, o ne ReservationDto, todėl sąrašą perkrauname iš API
      await loadReservations(appliedFilters);
    } catch (error) {
      setFormError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmAction = async () => {
    if (!pendingAction) return;

    const { type, reservation } = pendingAction;

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
            ? `Rezervacija „${reservation.title}“ atšaukta.`
            : `Susitikimas „${reservation.title}“ baigtas anksčiau.`,
      });

      await loadReservations(appliedFilters);
    } catch (error) {
      setNotice({ severity: "error", message: getErrorMessage(error) });
    } finally {
      setActionId(null);
    }
  };

  const fatalError = loadError ?? lookupError;

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
          Rezervacijos
        </Typography>
        <Button variant="contained" onClick={handleCreateClick}>
          Nauja rezervacija
        </Button>
      </Box>

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

      {fatalError ? (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={handleRetry}>
              Bandyti dar kartą
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

      <ReservationForm
        open={formOpen}
        rooms={rooms}
        users={users}
        submitting={submitting}
        error={formError}
        onSubmit={(dto) => void handleFormSubmit(dto)}
        onCancel={() => setFormOpen(false)}
      />

      <Dialog
        open={pendingAction !== null}
        onClose={() => setPendingAction(null)}
      >
        <DialogTitle>
          {pendingAction?.type === "cancel"
            ? "Atšaukti rezervaciją?"
            : "Baigti susitikimą anksčiau?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {pendingAction?.type === "cancel"
              ? `Rezervacija „${pendingAction.reservation.title}“ bus atšaukta. Šio veiksmo atšaukti nebus galima.`
              : pendingAction
                ? `Susitikimo „${pendingAction.reservation.title}“ pabaiga bus nustatyta į dabartinį laiką, o rezervacija pažymėta kaip baigta.`
                : ""}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setPendingAction(null)}>Ne</Button>
          <Button
            variant="contained"
            color={pendingAction?.type === "cancel" ? "error" : "primary"}
            onClick={() => void handleConfirmAction()}
          >
            {pendingAction?.type === "cancel"
              ? "Atšaukti rezervaciją"
              : "Baigti anksčiau"}
          </Button>
        </DialogActions>
      </Dialog>

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