import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const AppLayout = () => {
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <Sidebar />

      <main
        style={{
          flex: 1,
          padding: "2rem",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;