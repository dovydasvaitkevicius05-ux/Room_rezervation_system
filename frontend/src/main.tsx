import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

/**
 * Mounts the application into the root DOM element.
 * Wraps the app in BrowserRouter to enable client-side routing.
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);