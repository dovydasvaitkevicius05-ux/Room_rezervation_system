import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside
      style={{
        width: "250px",
        padding: "1rem",
        borderRight: "1px solid #ddd",
        minHeight: "100vh",
      }}
    >
      <h2>Viešbutis</h2>

      <nav>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <li>
            <NavLink to="/">Apžvalga</NavLink>
          </li>

          <li>
            <NavLink to="/rooms">Kambariai</NavLink>
          </li>

          <li>
            <NavLink to="/users">Naudotojai</NavLink>
          </li>

          <li>
            <NavLink to="/reservations">Rezervacijos</NavLink>
          </li>

          <li>
            <NavLink to="/room-usage">Kambarių panaudojimas</NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;