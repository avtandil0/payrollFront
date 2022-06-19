import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./i18n";

import { AuthProvider } from "react-oidc-context";

const oidcConfig = {
  authority: "https://localhost:5443",
  client_id: "payrolFront",
  // responseType: "code",
  redirect_uri: "https://localhost:3000",
  // ...
};

ReactDOM.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
