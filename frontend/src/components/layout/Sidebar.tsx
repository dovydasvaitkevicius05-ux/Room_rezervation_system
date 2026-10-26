import { NavLink } from "react-router-dom";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

// Define the navigation links displayed in the sidebar.
const links = [
  { to: "/rooms", label: "Rooms" },
  { to: "/users", label: "Users" },
  { to: "/reservations", label: "Reservations" },
  { to: "/room-usage", label: "Statistics" },
];

/**
 * Renders the sidebar with navigation links for the application.
 * Highlights the link corresponding to the currently active route.
 */
const Sidebar = () => {
  return (
    <Box
      component="aside"
      sx={{
        width: 260,
        flexShrink: 0,
        bgcolor: "#1e293b",
        color: "white",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Display the application title at the top of the sidebar. */}
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ opacity: 0.7 }}>
          Office room reservation system
        </Typography>
      </Box>

      <Divider sx={{ bgcolor: "rgba(255,255,255,0.15)" }} />

      {/* Render the main navigation menu. */}
      <Box
        component="nav"
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 2,
          gap: 1,
        }}
      >
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              textDecoration: "none",
              color: "white",
              padding: "12px 16px",
              borderRadius: "8px",
              backgroundColor: isActive
                ? "rgba(255,255,255,0.15)"
                : "transparent",
              fontWeight: isActive ? 600 : 400,
            })}
          >
            {link.label}
          </NavLink>
        ))}
      </Box>
    </Box>
  );
};

export default Sidebar;