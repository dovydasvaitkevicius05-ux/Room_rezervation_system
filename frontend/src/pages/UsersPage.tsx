import { useCallback, useEffect, useRef, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { UserTable } from "../components/users/UserTable";
import { ApiError } from "../services/apiClient";
import { userService } from "../services/userService";
import type { UserDto } from "../types/user";

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message || "Serveris grąžino klaidą.";
  }

  // fetch() meta TypeError, kai serveris nepasiekiamas
  if (error instanceof TypeError) {
    return "Nepavyko pasiekti serverio. Patikrinkite, ar API veikia, ir bandykite dar kartą.";
  }

  return "Įvyko nežinoma klaida.";
}

export function UsersPage() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Apsaugo nuo senesnio atsakymo, perrašančio naujesnį
  const requestIdRef = useRef(0);

  const loadUsers = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    setLoading(true);
    setLoadError(null);

    try {
      const data = await userService.getAll();
      if (requestId !== requestIdRef.current) return;
      setUsers(data);
    } catch (error) {
      if (requestId !== requestIdRef.current) return;
      setUsers([]);
      setLoadError(getErrorMessage(error));
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  // Pirmas užkrovimas
  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

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
          Vartotojai
        </Typography>
      </Box>

      {loadError ? (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => void loadUsers()}
            >
              Bandyti dar kartą
            </Button>
          }
        >
          {loadError}
        </Alert>
      ) : (
        <UserTable users={users} loading={loading} />
      )}
    </Container>
  );
}

export default UsersPage;