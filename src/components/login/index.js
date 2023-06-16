import React, { useState, useEffect } from 'react';

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, message } from "antd";
import { useHistory } from "react-router-dom";

import axios from "axios";
import constants from '../../constant'
import { HOME_PAGE } from '../../constant';


import "./index.css";

const Login =  () => {

  const [loading, setLoading] = useState(false);
  let history = useHistory();


  const onFinish = async (values) => {
    console.log("Received values of form: ", values);
    let user = {
      userName: values.username,
      password: values.password,
    }

    setLoading(true)
    const result = await axios.post(constants.API_PREFIX+"/api/Account/login", null, { params: user})
    setLoading(false)
    if(!result.data.isSuccess){
      message.error(result.data.message)
    }
    else{
      message.success("Success")
      localStorage.setItem('payrollAppLogintoken', result.data.message)

      // axios.defaults.headers.common = {'Authorization': `Bearer ${result.data.message}`}
      console.log('resultresultresultresult',result)
     const currentUser = await axios.get(constants.API_PREFIX+"/api/Account/currentUser", { params: user})
      //console.log('currentUser', currentUser)
      // localStorage.setItem('payrollAppUser', JSON.stringify({user: user}));
      localStorage.setItem('payrollAppUser', JSON.stringify(currentUser.data))
      // history.push(`${HOME_PAGE}/dashboard`); ????
      window.location.replace(`${HOME_PAGE}/dashboard`)
    }
    console.log(result)
  };

  return (
    <div style={{display: 'flex', justifyContent: 'center', paddingTop: 200}}>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your Username!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
            style={{width: 400}}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <a className="login-form-forgot" href="">
            Forgot password
          </a>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            loading={loading}
          >
            Log in
          </Button>

        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
