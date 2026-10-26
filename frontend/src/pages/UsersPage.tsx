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
 * Renders the users page with a table of users.
 * Also handles loading data and showing errors.
 */
export function UsersPage() {
  // Store the users displayed on the page and track the loading state and error.
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Store the ID of the latest request to ignore outdated responses.
  const requestIdRef = useRef(0);

  // Load users from the API.
  const loadUsers = useCallback(async () => {
    // Mark this request as the latest one.
    const requestId = ++requestIdRef.current;

    setLoading(true);
    setLoadError(null);

    try {
      const data = await userService.getAll();
      // Ignore the response if a newer request has been started.
      if (requestId !== requestIdRef.current) return;
      setUsers(data);
    } catch (error) {
      if (requestId !== requestIdRef.current) return;
      setUsers([]);
      setLoadError(getErrorMessage(error));
    } finally {
      // Hide the loading indicator only if this is still the latest request.
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  // Load the users once when the page is opened.
  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

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
          Users
        </Typography>
      </Box>

      {/* Show an error with a retry button, or the user table if loading succeeded. */}
      {loadError ? (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => void loadUsers()}
            >
              Try Again
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