import React, { useState, useEffect } from "react";
import moment from "moment";

import "antd/dist/antd.css";
import {
  Table,
  Divider,
  Select,
  Modal,
  Button,
  message,
  Form,
  Input,
  Space,
  Popconfirm,
  Tooltip,
  DatePicker,
  Tag,
  Upload,
  Steps,
  Row,
  Col,
  Result,
} from "antd";
import {
  PlusCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
  ImportOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";

import { OutTable, ExcelRenderer } from "react-excel-renderer";
import axios from "axios";
import constants from "../../constant";
import { useTranslation } from "react-i18next";
import { groupBy, map } from "lodash";

import "./index.css";

const { Option } = Select;
const { Step } = Steps;

function FileImportResultStep3({ next, file, setFile }) {
  return (
    <>
      <Result
        status="success"
        title="Successfully Purchased Cloud Server ECS!"
        subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
        extra={[
          <Button type="primary" key="console">
            Go Console
          </Button>,
          <Button key="buy">Buy Again</Button>,
        ]}
      />
    </>
  );
}

export default FileImportResultStep3;
