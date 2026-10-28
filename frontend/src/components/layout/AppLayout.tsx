import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";

import Sidebar from "./Sidebar";

/**
 * Defines the main application layout, including the sidebar
 * and the content area for the currently selected route.
 */
const AppLayout = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Display the sidebar alongside the main content. */}
      <Sidebar />

      {/* Render the content of the currently matched child route. */}
      <Box
        component="main"
        sx={{
          flex: 1,
          bgcolor: "#f5f5f5",
          p: 3,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;