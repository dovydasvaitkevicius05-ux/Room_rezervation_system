import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";

import Sidebar from "./Sidebar";

const AppLayout = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

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