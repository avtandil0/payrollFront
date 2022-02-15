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

function UploadFileStep1({ next, file, setFile }) {
  console.log("nextnextnext", next);
  const { t } = useTranslation();
  const [fileIsUploaded, setFileIsUploaded] = useState(false);


  const fileHandler = (e) => {
    console.log("eeeee", e);
    // let fileObj = e.target.files[0];
    let fileObj = e.file.originFileObj;
    // let fileObj = e.fileList[0] ? e.fileList[0].originFileObj : {};
    console.log(fileObj);

    //just pass the fileObj as parameter
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        console.log("filefilefilefilefilefile", file);
        setFile({
          cols: resp.cols,
          rows: resp.rows,
        });
      }
    });
  };

  const uploadFile = () => {
    console.log("avtooo", next);
    next();
  };

  const uploadProps = {
    name: "file",
    // action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <>
      <div style={{ display: "flex" }}>
        <Upload
          {...uploadProps}
          onChange={fileHandler}
          customRequest={({ file, onSuccess }) => {
            setTimeout(() => {
              setFileIsUploaded(true);
              onSuccess("ok");
            }, 0);
          }}
        >
          <Button style={{ marginLeft: 15 }} icon={<UploadOutlined />}>
            {t(`chooseBankFile`)}
          </Button>
        </Upload>
      </div>

      {/* <input type="file" onChange={fileHandler} /> */}

      {file && (
        <>
          {/* <Divider /> */}
          <Button
            style={{ marginTop: 30, marginLeft: 15 }}
            onClick={uploadFile}
            type="primary"
            icon={<CloudUploadOutlined />}
            disabled={!fileIsUploaded}
          >
            {t(`upload`)}
          </Button>
          <div
            style={{
              width: "98%",
              height: "650px",
              overflow: "scroll",
              marginTop: 15,
              marginLeft: 15,
            }}
          >
            <OutTable
              data={file.rows}
              columns={file.cols}
              tableClassName="table"
              tableHeaderRowClass="heading"
            />
          </div>
        </>
      )}
    </>
  );
}

export default UploadFileStep1;
