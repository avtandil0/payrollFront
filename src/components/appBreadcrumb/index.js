import { HomeOutlined, SnippetsOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import React, { useState, useEffect, useContext } from "react";
import {
  useLocation,
} from "react-router-dom";

export const AppBreadcrumb = () => {

  let location = useLocation();
  const [locationPath, setLocationPath] = useState('')

  useEffect(() =>{
    console.log(12121,location)
    setLocationPath(location.pathname.replace('/payroll/', ''))
  },[location.pathname])

  return (
    <div style={{margin: 10}}>
      <Breadcrumb>
        <Breadcrumb.Item >
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item >
        <SnippetsOutlined />
          <span>{locationPath}</span>
        </Breadcrumb.Item>
      </Breadcrumb>
    </div>
  );
};
