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

function ProcessingFileStep2({ next, file, setFile }) {
  const { t } = useTranslation();
  let groupd = groupBy(file.rows, (r) => r[19]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [importDataInDBLoading, setImportDataInDBLoading] = useState(false);
  const [components, setComponents] = useState([]);

  const [chosenData, setChosenData] = useState([]);
  const [importData, setImportData] = useState({
    paidPeriod: null,
    paidDate: null,
    componentId: null,
    persons: [],
  });

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    const result = await axios(
      constants.API_PREFIX + "/api/Component/getAllActive"
    );

    setComponents(result.data);
  };

  const onSelectChange = (selectedRowKeys) => {
    let selectedData = [];
    selectedRowKeys.forEach((element) => {
      console.log("[...groupedData[element].data]", groupedData[element].data);
      selectedData = [...selectedData, ...groupedData[element].data];
    });

    setChosenData([...selectedData]);
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const groupedColumns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Count",
      dataIndex: "count",
    },
  ];

  const columns = [
    // {
    //   title: "Date",
    //   dataIndex: "date",
    // },
    {
      title: "receiverAcoountNumber",
      dataIndex: "receiverAcoountNumber",
      render: (_, record) => <p>{record[16]}</p>,
    },
    {
      title: "receiver",
      dataIndex: "receiver",
      render: (_, record) => <p>{record[14]}</p>,
    },
    {
      title: "destination",
      dataIndex: "destination",
      render: (_, record) => <p>{record[19]}</p>,
    },
    {
      title: "amount",
      dataIndex: "amount",
      render: (_, record) => <p>{record[21]}</p>,
    },
  ];

  const groupedData = [];

  let i = 0;
  for (const [key, value] of Object.entries(groupd)) {
    groupedData.push({
      key: i,
      name: key,
      count: value.length,
      data: value,
    });
    i++;
  }

  console.log("groupedData", groupedData);

  const importDataInDB = async () => {
    let impD = {
      ...importData,
      persons: map(chosenData, (r) => ({
        bankAccountNumber: r[16],
        BankName: r[18],
        destination: r[19],
        fullName: r[14],
        personalNumber: r[15],
        amount: r[3],
      })),
    };
    console.log("chosenData", chosenData, impD);

    setImportDataInDBLoading(true);
    try {
      var result = await axios.post(
        constants.API_PREFIX + "/api/Calculation/paid",
        impD
      );
    } catch (e) {
      setImportDataInDBLoading(false);
      return;
    }

    console.log("result", result);
    if (!result.data.isSuccess) {
      if (result.data.code == 10) {
        message.error('This BankAccountNumbers does not exists - ' + result.data.message, 5)
      }
      if (result.data.code == 20) {
        message.error('This PersonalNumbers does not match - ' + result.data.message, 5)
      }
      setImportDataInDBLoading(false);
      return;
    }
    next();
  };

  const handleChangeForm = (value, name) => {
    setImportData({ ...importData, [name]: value });
    console.log("------", value, name);
  };

  return (
    <>
      <div style={{ backgroundColor: "white", height: 5 }}></div>
      <Row>
        <Col span={12}>
          <Table
            size="small"
            rowSelection={rowSelection}
            dataSource={groupedData}
            columns={groupedColumns}
          />
        </Col>
        <Col span={12}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <div>
              <div style={{ display: "flex" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span> {t(`period`)} </span>
                  <DatePicker
                    onChange={(e) => handleChangeForm(e, "paidPeriod")}
                    picker="month"
                    style={{ marginTop: 5 }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: 15,
                  }}
                >
                  <span> {t(`paidDate`)} </span>
                  <DatePicker
                    onChange={(e) => handleChangeForm(e, "paidDate")}
                    style={{ marginTop: 5 }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: 15,
                  }}
                >
                  <span> {t(`component`)} </span>
                  <Select
                    defaultValue="აირჩიეთ"
                    onChange={(value) => handleChangeForm(value, "componentId")}
                    style={{ width: "149px", marginTop: 5 }}
                  >
                    {components.map((i) => (
                      <Option value={i.id}>{i.name}</Option>
                    ))}
                  </Select>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 25,
                }}
              >
                <Button
                  onClick={importDataInDB}
                  loading={importDataInDBLoading}
                  type="primary"
                  icon={<CloudUploadOutlined />}
                  size="large"
                >
                  Process
                </Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <div style={{ backgroundColor: "white", height: 25 }}></div>
      <Table size="small" dataSource={chosenData} columns={columns} />
    </>
  );
}

export default ProcessingFileStep2;
