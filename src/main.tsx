import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./style.css";
import { BrowserRouter } from "react-router";
import { DataContextProvider } from "./context/contentContext";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DataContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DataContextProvider>
  </React.StrictMode>,
);
