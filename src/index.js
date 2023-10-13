import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./i18n";
import axios from "axios";

import { AuthProvider } from "react-oidc-context";
import { HOME_PAGE } from "./constant";

const oidcConfig = {
  authority: "https://localhost:5443",
  client_id: "payrolFront",
  // responseType: "code",
  redirect_uri: "https://localhost:3000",
  // ...
};

axios.interceptors.request.use(
  function (config) {
    let token = localStorage.getItem("payrollAppLogintoken");
    console.log('configconfig',config)
    if(!config.url.includes('eapi.rs.ge')){
      config.headers.common = { Authorization: `Bearer ${token}` };
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    console.log("iiiiiiii", response);
    // Edit response config
    return response;
  },
  (error) => {
    console.log("iiiiiiii error", error.response?.status);
    if (error.response?.status == 401) {
      localStorage.clear();
      window.location.href = "/" + HOME_PAGE;
    }
    return Promise.reject(error);
  }
);

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
