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

function CalculateFromFile({ next }) {
  console.log("nextnextnext", next);
  const { t } = useTranslation();

  const [file, setFile] = useState({
    cols: [
      { name: "A", key: 0 },
      { name: "B", key: 1 },
      { name: "C", key: 2 },
      { name: "D", key: 3 },
      { name: "E", key: 4 },
      { name: "F", key: 5 },
      { name: "G", key: 6 },
      { name: "H", key: 7 },
      { name: "I", key: 8 },
      { name: "J", key: 9 },
      { name: "K", key: 10 },
      { name: "L", key: 11 },
      { name: "m", key: 12 },
    ],
    rows: [
      [""],
      [""],
      [""],
      [""],
      [""],
      [""],
      [""],
      [""],
      [""],
      [""],
      [""],
      [""],
      [""],
      [""],
      [""],
      [""],
      [""],
    ],
  });

  const [fileIsUploaded, setFileIsUploaded] = useState(false);
  const [fileList, setFileList] = useState([]);

  const fileHandler = (e) => {
    console.log("eeeee", e);
    // let fileObj = e.target.files[0];
    let fileObj = e.file.originFileObj;
    // let fileObj = e.fileList[0] ? e.fileList[0].originFileObj : {};
    console.log("fileObjfileObjfileObj", fileObj);
    setNotExist(false);
    setFileList([fileObj]);
    //just pass the fileObj as parameter
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        console.log("filefilefilefilefilefile", resp);
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const [uploading, setUploading] = useState(false);
  const [notExist, setNotExist] = useState(false);

  const handleOk = async () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("file", file);
    });
    setUploading(true);
    // You can use any AJAX library you like
    axios
      .post(
        constants.API_PREFIX +
          `/api/Calculation/CreateEmployeeFromFile/${date}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => res)
      .then((res) => {
        console.log("res.data.employees", res);
        // setFileList([]);
        if(!res.data.employees && !res.data.success){
          message.error(res.data.message);
          return;
        }
        if (!res.data.success) {
          setFileIsUploaded (false);
          setNotExist(true);
          const firstRow = [
            [
              "",
              "სახელი და გვარი",
              "GLAccount",
              "Project",
              "Cost Center",
              "Cost Unit	",
              "პირადი ნომერი",
              "ხელფასი",
              "კომპონენტი",
            ],
          ];
          setFile({
            cols: file.cols,
            rows: [...firstRow,...res.data.employees.map((r) => {
              return [
                ...[
                  [""],
                  [r.fullname],
                  [r.glAccount],
                  [r.project],
                  [r.costCenter],
                  [r.costUnit],
                  [r.personalNumber],
                  [r.amount],
                  [r.component],
                ],
              ];
            })],
          });

          setUploading(false);
        } else {
          console.log("res.datares.data", res.data);
          if (res.data.success) {
            message.success(res.data.message);
          }
          setUploading(false);
        }
      })
      .catch((err) => {
        console.log("eeeerrrr", err);
        message.error("upload failed.");
      })
      .finally(() => {
        setUploading(false);
    setIsModalOpen(false);

      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onChange = (date, dateString) => {
    console.log(date, dateString);
    setDate(dateString);
  };

  return (
    <>
      <div style={{ display: "flex" }}>
        <Upload
          fileList={fileList}
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
            {t(`Choose File`)}
          </Button>
        </Upload>
      </div>

      {/* <input type="file" onChange={fileHandler} /> */}

      {file && (
        <>
          {/* <Divider /> */}
          <Button
            style={{ marginTop: 30, marginLeft: 15 }}
            onClick={showModal}
            type="primary"
            icon={<CloudUploadOutlined />}
            disabled={!fileIsUploaded || notExist}
          >
            {t(`upload`)}
          </Button>
          <Modal
            title="Calculation"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Calculate"
            width={500}
            okButtonProps={{ loading: uploading }}
          >
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <p>Choose date</p>
              <DatePicker onChange={onChange} />
            </div>
          </Modal>
          {notExist ? (
            <div>
              <h3 style={{ color: "red", marginLeft: 50, marginTop: 15 }}>
                {" "}
                This records does Not exist in database !
              </h3>{" "}
            </div>
          ) : null}
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
              tableClassName={notExist? "table error": "table "}
              tableHeaderRowClass="heading "
            />
          </div>
        </>
      )}
    </>
  );
}

export default CalculateFromFile;
