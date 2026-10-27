import { Navigate, Route, Routes } from "react-router-dom";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./App.css";

import AppLayout from "./components/layout/AppLayout";
import ReservationsPage from "./pages/ReservationsPage";
import RoomUsagePage from "./pages/RoomUsagePage";
import RoomsPage from "./pages/RoomsPage";
import UsersPage from "./pages/UsersPage";

/**
 * Renders the application routes within the shared layout.
 * Redirects the root path to the rooms page.
 */
function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/rooms" replace />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/reservations" element={<ReservationsPage />} />
        <Route path="/room-usage" element={<RoomUsagePage />} />
      </Route>
    </Routes>
  );
}

export default App;