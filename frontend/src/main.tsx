import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./style.css";
import App from "./App";
import { DBProvider } from "./context/DBContext";

const container = document.getElementById("root");

const root = createRoot(container!);

root.render(
  <React.StrictMode>
    {" "}
    <DBProvider>
      <App />
    </DBProvider>
  </React.StrictMode>
);
