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

  const [current, setCurrent] = React.useState(0);
  const [components, setComponents] = useState([]);

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    // setTableLoading(true);
    const result = await axios(
      constants.API_PREFIX + "/api/Component/getAllActive"
    );

    console.log("fetchComponents", result);
    setComponents(result.data);
    // setTableLoading(false);
  };

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const uploadFile = () => {
    console.log(file);
    next();
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

  const uploadFileStep1 = () => {
    return (
      <>
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
  };

  const ProcessingFileStep2 = () => {
    const { t } = useTranslation();
    // console.log(8998, file.rows);
    let groupd = groupBy(file.rows, (r) => r[19]);
    // console.log(8998777777777, groupd.BONUS);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const [chosenData, setChosenData] = useState([]);
    const [importData, setImportData] = useState({
      period: null,
      calculationDate: null,
      componentId: null,
      persons: []
    });

    const onSelectChange = (selectedRowKeys) => {
      let selectedData = [];
      selectedRowKeys.forEach((element) => {
        console.log(
          "[...groupedData[element].data]",
          groupedData[element].data
        );
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

    // Object.entries(groupd).forEach(element => {
    //   columns.push( {
    //     title: element,
    //     dataIndex: element,
    //   })
    // });

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
      // const result = await axios(constants.API_PREFIX + "/api/Component");
      let impD ={
        ...importData,
        persons: map(chosenData, (r) => ({
          'bankAccountNumber': r[16],
          'BankName': r[18],
          'destination': r[19],
          'fullName': r[14],
          'amount': r[3],
        }) )
      }
      console.log('chosenData', chosenData,impD)

      const result = await axios.post(constants.API_PREFIX + "/api/Calculation/paid", impD);
      console.log('result', result)
      // next();
    };

    const handleChangeForm = (value, name) => {
      setImportData({ ...importData, [name]: value  });
      console.log('------', value, name)
    }

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
                <div style={{display: 'flex'}}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span> {t(`period`)} </span>
                    <DatePicker onChange={(e) => handleChangeForm(e, 'period')} picker="month" style={{marginTop: 5}}/>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", marginLeft: 15 }}>
                    <span> {t(`paidDate`)} </span>
                    <DatePicker onChange={(e) => handleChangeForm(e, 'calculationDate')} style={{marginTop: 5}} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column",  marginLeft: 15 }}>
                    <span> {t(`component`)} </span>
                    <Select
                      defaultValue="აირჩიეთ"
                      onChange={(value) => handleChangeForm(value, 'componentId')}
                      style={{width: '149px', marginTop: 5}}
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
  };

  const FileImportResultStep3 = () => {
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
        ,
      </>
    );
  };

  const steps = [
    {
      title: "First",
      content: uploadFileStep1(),
    },
    {
      title: "Second",
      content: ProcessingFileStep2(),
    },
    {
      title: "Last",
      content: FileImportResultStep3(),
    },
  ];

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

  return (
    <div>
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      {/* <Divider /> */}
      {/* <br /> */}

      {/* <div className="steps-action">
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            type="primary"
            onClick={() => message.success("Processing complete!")}
          >
            Done
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div> */}

      <div className="steps-content">{steps[current].content}</div>

      <br />
    </div>
  );
}

export default Import;
