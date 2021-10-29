import React, { createContext, useState, useContext, useEffect } from "react"
import constants from './constant'
import axios from "axios";

export const UserContext = createContext();

// This context provider is passed to any component requiring the context
export const AppProvider = ({ children }) => {
  const [globalDepartments, setglobalDepartments] = useState([]);

  const fetchDepartments = async () => {
    // setTableLoading(true);
    const result = await axios(constants.API_PREFIX + "/api/department");

    console.log('result fetchDepartments---', result.data)
    setglobalDepartments(result.data)
    // setTableLoading(false);
  }

  
  useEffect(() => {
    fetchDepartments();
  }, []);


  return (
    <UserContext.Provider
      value={{
        globalDepartments,
        setglobalDepartments
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
