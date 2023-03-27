import React, { useState, useEffect } from "react";

import "./App.css";
import "antd/dist/antd.css";
import Home from "./components/home/index";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AppProvider } from "./appContext";
import { AuthProvider } from "oidc-react";
import { useAuth } from "react-oidc-context";
import Login from "./components/login";
import axios from "axios";
import constants from "./constant";

const oidcConfig = {
  onSignIn: async (user) => {
    alert("You just signed in, congratz! Check out the console!");
    console.log("userusersuresr", user);
    window.location.hash = "";
  },
  authority: "https://localhost:5443",
  clientId: "payrolFront",
  responseType: "code",
  redirectUri: "https://localhost:3000",
};

const oidcConfig1 = {
  onSignIn: async (user) => {
    alert("You just signed in, congratz! Check out the console!");
    console.log(user);
    window.location.hash = "";
  },
  authority: "https://accounts.google.com",
  clientId:
    "1066073673387-undfdseanu1soilcdprq1p4m8gq8a1iu.apps.googleusercontent.com",
  responseType: "id_token",
  redirectUri: "http://localhost:3000/",
};

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);

  const setCurrentUser = async () => {
    let user = localStorage.getItem("payrollAppUser");
    let token = localStorage.getItem("payrollAppLogintoken");
    axios.defaults.headers.common = {'Authorization': `Bearer ${token}`}
    console.log('userrrrrrrr', user)
    const currentUser = await axios.get(
      constants.API_PREFIX + "/api/Account/currentUser",
      { params: JSON.parse(user) }
    );
    console.log("currentUser", currentUser);
    localStorage.setItem("payrollAppUser", JSON.stringify(currentUser.data));
  };
  useEffect(() => {
    let token = localStorage.getItem("payrollAppLogintoken");
    if (token) {
      // setCurrentUser();
      setIsAuthorized(true);
    }
  }, []);

  return (
    // <AuthProvider {...oidcConfig}>

    <div className="App">
      <AppProvider>
        <Router>
          <Switch>
            <Route>{isAuthorized ? <Home /> : <Login />}</Route>
          </Switch>
        </Router>
      </AppProvider>
    </div>
    // </AuthProvider>
  );
}

export default App;
