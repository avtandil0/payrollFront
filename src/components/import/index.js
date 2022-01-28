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
} from "antd";
import {
  PlusCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
  ImportOutlined,
} from "@ant-design/icons";

import { OutTable, ExcelRenderer } from "react-excel-renderer";

import axios from "axios";
import constants from "../../constant";
import { useTranslation } from "react-i18next";
import "./index.css";
const { Option } = Select;

function Import() {
  const { t } = useTranslation();

  const columns = [
    // {
    //   title: 'id',
    //   dataIndex: 'id',
    // },
    {
      title: t(`actions`),
      dataIndex: "actions",
      render: (text, record) => (
        <div>
          <Space>
            <Popconfirm
              title="Are you sure to delete this task?"
              onConfirm={() => confirm(record)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip placement="bottom" title="წაშლა">
                <Button type="primary" icon={<DeleteOutlined />} />
              </Tooltip>
            </Popconfirm>
            <Tooltip placement="bottom" title="რედაქტირება">
              <Button
                onClick={() => clickEdit(record)}
                type="primary"
                icon={<EditOutlined />}
              />
            </Tooltip>
          </Space>
        </div>
      ),
    },
    {
      title: t(`status`),
      dataIndex: "status",
      render: (status, row) => (
        <span>
          <Tag color={row.status.value == 1 ? "green" : "volcano"}>
            {row.status.value == 1 ? t(`active`) : t(`passive`)}
          </Tag>
        </span>
      ),
    },
    {
      title: t(`placeholderFirstName`),
      dataIndex: "name",
      render: (text) => <p>{text}</p>,
    },
    {
      title: t(`coefficient`),
      dataIndex: "coefficientName",
    },
    {
      title: t(`creditAcount`),
      dataIndex: "creditAccountName",
    },
    {
      title: t(`debitAcount`),
      dataIndex: "debitAccountName",
    },
    {
      title: t(`start`),
      dataIndex: "startDate",
      render: (startDate, row) => (
        <span>
          {row.status.fieldNames &&
          row.status.fieldNames.includes("StartDate") ? (
            <Tag color={"volcano"}>
              {moment(startDate).format("YYYY-MM-DD")}
            </Tag>
          ) : (
            moment(startDate).format("YYYY-MM-DD")
          )}
        </span>
      ),
    },
    {
      title: t(`finish`),
      dataIndex: "endDate",
      render: (endDate, row) => (
        <span>
          {row.status.fieldNames &&
          row.status.fieldNames.includes("EndDate") ? (
            <Tag color={"volcano"}>{moment(endDate).format("YYYY-MM-DD")}</Tag>
          ) : (
            moment(endDate).format("YYYY-MM-DD")
          )}
        </span>
      ),
    },
    {
      title: t(`dateOfCreation`),
      dataIndex: "dateCreated",
      render: (text) => <p>{moment(text).format("YYYY-MM-DD")}</p>,
    },
  ];

  const [dataSaveArray, setDataSaveArray] = useState([]);
  const [component, setComponent] = useState({
    name: "",
    coefficientId: null,
    creditAccountId: null,
    debitAccountId: null,
    startDate: null,
    endDate: null,
  });
  const [tableLoading, setTableLoading] = useState(false);
  const [isEdiT, setIsEdiT] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [accountsReportChartType, setAccountsReportChartType] = useState([]);

  const [accountsReportCharts, setAccountsReportCharts] = useState([]);
  const [coefficients, setCoefficients] = useState([]);
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
    ],
  });

  const fetchData = async () => {
    setTableLoading(true);
    const result = await axios(constants.API_PREFIX + "/api/Component");
    console.log("result", result.data);

    setDataSaveArray(result.data);
    setTableLoading(false);
  };

  const fetchAaccountsReportCharts = async () => {
    // setTableLoading(true);
    const result = await axios(
      constants.API_PREFIX + "/api/AccountsReportChart"
    );
    setAccountsReportCharts(result.data);
    // setTableLoading(false);
  };

  const fetchCoefficients = async () => {
    // setTableLoading(true);
    const result = await axios(constants.API_PREFIX + "/api/Coefficient");

    console.log("result Coifficient---", result.data);
    setCoefficients(result.data);
    // setTableLoading(false);
  };

  useEffect(() => {
    fetchData();
    fetchAaccountsReportCharts();
    fetchCoefficients();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    setIsModalVisible(false);
    setIsEdiT(false);
    console.log("component", component);
    if (!isEdiT) {
      const result = await axios.post(
        constants.API_PREFIX + "/api/Component",
        component
      );
      console.log("resultPost", result);
      if (result.data.isSuccess) {
        fetchData();
        message.success(result.data.message);
      } else {
        message.error(result.data.message);
      }
    } else {
      const result1 = await axios.put(
        constants.API_PREFIX + "/api/Component",
        component
      );
      console.log("result1", result1);
      if (result1.data.isSuccess) {
        fetchData();
        message.success(result1.data.message);
      } else {
        message.error(result1.data.message);
      }
    }

    setComponent({
      name: "",
      coefficientId: null,
      creditAccountId: null,
      debitAccountId: null,
      startDate: null,
      endDate: null,
    });
  };

  const handleCancel = () => {
    setIsEdiT(false);
    setIsModalVisible(false);
    setComponent({
      name: "",
      coefficientId: null,
      creditAccountId: null,
      debitAccountId: null,
      startDate: null,
      endDate: null,
    });
  };

  const handleChange = (e) => {
    // console.log('handleChange', e.target);
    setComponent({ ...component, [e.target.name]: e.target.value });
  };

  const confirm = async (record) => {
    console.log("record", record);
    const result = await axios.delete(constants.API_PREFIX + "/api/Component", {
      data: record,
    });
    console.log("result", result);
    if (result.data.isSuccess) {
      message.success(result.data.message);
      fetchData();
    } else {
      message.error(result.data.message);
    }
  };

  const clickEdit = (record) => {
    setIsEdiT(true);
    console.log("clickEdit", record);
    setComponent(record);
    setIsModalVisible(true);
  };

  const handleChangeSelect = (value, name) => {
    setComponent({ ...component, [name]: value });
    console.log("handleChangeSelect", value);
  };

  function onChange(date, dateString) {
    console.log(date, dateString);
  }

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

  const importFile = () => {
    console.log(file)
  }

  return (
    <div>
      <div style={{ display: "flex" }}>
        <Upload
          {...uploadProps}
          onChange={fileHandler}
          customRequest={({ file, onSuccess }) => {
            setTimeout(() => {
              onSuccess("ok");
            }, 0);
          }}
        >
          <Button icon={<UploadOutlined />}>{t(`uploadBankFile`)}</Button>
        </Upload>
      </div>

      {/* <input type="file" onChange={fileHandler} /> */}
      {file && (
        <>
          <Divider />
          <Button onClick={importFile} type="primary" icon={<ImportOutlined />}>
            {t(`import`)}
          </Button>
          <div style={{ width: "98%", height: "750px", overflow: "scroll", marginTop: 15}}>
            <OutTable
              data={file.rows}
              columns={file.cols}
              tableClassName="table"
              tableHeaderRowClass="heading"
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Import;
