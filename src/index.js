import React from "react";
import ReactDOM from "react-dom";
import "./assets/css/index.css";
import App from "./App";
import { UserContextProvider } from "./context/UserContext";

ReactDOM.render(
  <React.StrictMode>
    <UserContextProvider>
      <App />
    </UserContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
