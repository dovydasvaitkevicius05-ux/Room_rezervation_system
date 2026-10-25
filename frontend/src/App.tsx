import { Routes, Route } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";

import DashboardPage from "./pages/DashboardPage";
import RoomsPage from "./pages/RoomsPage";
import UsersPage from "./pages/UsersPage";
import ReservationsPage from "./pages/ReservationsPage";
import RoomUsagePage from "./pages/RoomUsagePage";

import './App.css'

function App() {
  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/room-usage" element={<RoomUsagePage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
