import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./index.css";

import { Row, Col, Button } from "antd";
import { Statistic, Card, Progress, Alert, Space } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  LikeOutlined,
  RiseOutlined,
} from "@ant-design/icons";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useParams,
  useRouteMatch,
  useLocation,
} from "react-router-dom";

import axios from "axios";
import { exportedFunction, Rectangle } from "../../test";

function Dashboard() {
  const { Countdown } = Statistic;
  const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30; // Moment is also OK

  function onFinish() {
    console.log("finished!");
  }

  function onChange(val) {
    if (4.95 * 1000 < val && val < 5 * 1000) {
      console.log("changed!");
    }
  }

  useEffect(() => {

  }, []);

  return (
    <div>
      <Row>
        <Col span={12}>
          {" "}
          <Row gutter={16}>
            <Col span={12}>
              <div style={{ display: "flex" }}>
                <Space size="large">
                  <div>
                    <Statistic title="Active Users" value={1460} />
                  </div>
                  <div>
                    <Statistic title="Passive Users" value={379} />
                  </div>
                  <div>
                    <Statistic title="Analitics" value={1000} />
                  </div>
                  <div>
                    <Statistic title="Operators" value={460} />
                  </div>
                </Space>
              </div>
            </Col>
            <Col span={12}>
              <Statistic
                title="Account Balance (CNY)"
                value={112893}
                precision={2}
              />
              <Button style={{ marginTop: 16 }} type="primary">
                Recharge
              </Button>
            </Col>
            <Col span={12}>
              <Statistic title="Active Users" value={112893} loading />
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Row gutter={16}>
            <Col span={12}>
              <Card>
                <Statistic
                  title="Active"
                  value={11.28}
                  precision={2}
                  valueStyle={{ color: "#3f8600" }}
                  prefix={<ArrowUpOutlined />}
                  suffix="%"
                />
                <br />
                <Progress percent={30} />
                <Progress percent={50} status="active" />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Statistic
                  title="Idle"
                  value={9.3}
                  precision={2}
                  valueStyle={{ color: "#cf1322" }}
                  prefix={<ArrowDownOutlined />}
                  suffix="%"
                />
                <br />
                <Progress percent={70} status="exception" />
                <Progress percent={100} />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      <br />
      <br />

      <Row>
        <Col span={12}>
          {" "}
          <Row gutter={16}>
            <Col span={12}>
              <Statistic
                title="Feedback"
                value={1128}
                prefix={<LikeOutlined />}
              />
            </Col>
            <Col span={12}>
              <Statistic title="Unmerged" value={93} suffix="/ 100" />
            </Col>
          </Row>
          <br />
          <br />
          <Row gutter={16}>
            <Col span={12}>
              <Statistic
                title="Feedback"
                value={400.456}
                prefix={<RiseOutlined />}
              />
            </Col>
            <Col span={12}>
              <Statistic title="Test" value={235} suffix="/ 405" />
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          {" "}
          <Row gutter={16}>
            <Col span={12}>
              <Countdown
                title="Countdown"
                value={deadline}
                onFinish={onFinish}
              />
            </Col>
            <Col span={12}>
              <Countdown
                title="Million Seconds"
                value={deadline}
                format="HH:mm:ss:SSS"
              />
            </Col>
            <Col span={24} style={{ marginTop: 32 }}>
              <Countdown
                title="Day Level"
                value={deadline}
                format="HH:mm:ss:SSS"
              />
            </Col>
            <Col span={12}>
              <Countdown
                title="Countdown"
                value={Date.now() + 10 * 1000}
                onChange={onChange}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <br />
      <br />
      <Row>
        <Col span={10}>
          <Progress
            strokeColor={{
              "0%": "#108ee9",
              "100%": "#87d068",
            }}
            percent={91.9}
          />
          <Progress
            strokeColor={{
              from: "#108ee9",
              to: "#87d068",
            }}
            percent={99.9}
            status="active"
          />
          <br />
          <br />
          <Progress
            type="circle"
            strokeColor={{
              "0%": "#108ee9",
              "100%": "#87d068",
            }}
            percent={90}
          />
          <Progress
            type="circle"
            strokeColor={{
              "0%": "#108ee9",
              "100%": "#87d068",
            }}
            percent={45}
          />{" "}
        </Col>
        <Col span={2}></Col>
        <Col span={11}>
          <Alert
            message="Success Tips"
            description="Detailed description and advice about successful copywriting."
            type="success"
            showIcon
          />
          <br />
          <Alert
            message="Warning"
            description="This is a warning notice about copywriting."
            type="warning"
            showIcon
            closable
          />
          <br />
        </Col>
      </Row>
    </div>
  );
}
export default Dashboard;
