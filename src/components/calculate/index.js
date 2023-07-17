import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  Tooltip,
  Col,
  Input,
  Row,
  DatePicker,
  Select,
  Modal,
  Drawer,
  Divider,
  Upload,
  message,
} from "antd";
import {
  CalculatorOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  FileExcelOutlined,
  UploadOutlined,
  FileExcelFilled,
} from "@ant-design/icons";
import axios from "axios";
import constants from "../../constant";
import moment from "moment";
import { sumBy } from "lodash";
import "./index.css";
import MyDrawer from "./drawer";
import { useTranslation, initReactI18next } from "react-i18next";
import { UserContext } from "../../appContext";
import { UploadCalculations } from "./uploadCalculations";
import qs from "qs";
import { orderBy } from "lodash";
import { useHistory, useLocation } from "react-router-dom";
import { HOME_PAGE } from "../../constant";

const { Option } = Select;

function Calculate() {
  const { user } = useContext(UserContext);
  const { t } = useTranslation();

  const confirmAll = async (record) => {
    console.log("record", record, filter);
    const result = await axios.delete(
      constants.API_PREFIX + `/api/Calculation/deleteCalculations`,
      {
        params: {
          id: record.key,
          calculationPeriod: filter.calculationPeriod,
        },
      }
    );
    console.log("result", result);
    if (result.data.isSuccess) {
      message.success(result.data.message);
      search();
    } else {
      message.error(result.data.message);
    }
  };

  const confirm = async (record) => {
    console.log("record", record);
    const result = await axios.delete(
      constants.API_PREFIX + `/api/Calculation/Delete/${record.id}`
    );
    console.log("result", result);
    if (result.data.isSuccess) {
      message.success(result.data.message);
      search();
    } else {
      message.error(result.data.message);
    }
  };

  const expandedRowRender = ({ childrens }) => {
    console.log("childrenchildren", childrens);

    const columns = [
      {
        title: "Actions",
        dataIndex: "Actions",
        key: "Actions",
        render: (text, row) => {
          return (
            <Popconfirm
              title="Are you sure to delete this?"
              onConfirm={() => confirm(row)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip placement="bottom" title="წაშლა">
                <Button
                  shape="circle"
                  icon={<DeleteOutlined style={{ color: "red" }} />}
                />
              </Tooltip>
            </Popconfirm>
          );
        },
      },
      { title: "Component Name", dataIndex: "name", key: "name" },
      {
        title: "calculationDate",
        dataIndex: "calculationDate",
        key: "calculationDate",
      },
      { title: "Gross", dataIndex: "gross", key: "gross" },
      { title: "Net", dataIndex: "net", key: "net" },
      { title: "Paid", dataIndex: "paid", key: "paid" },
      { title: "IncomeTax", dataIndex: "incomeTax", key: "incomeTax" },
      { title: "PensionTax", dataIndex: "pensionTax", key: "pensionTax" },
      {
        title: "RemainingGraceAmount",
        dataIndex: "remainingGraceAmount",
        key: "RemainingGraceAmount",
      },
      // {
      //   title: t(`totalBalance`),
      //   dataIndex: "TotalBalance",
      //   render: (text, row) => <p> {row.totalBalance}</p>,
      // },
    ];

    return (
      <Table columns={columns} dataSource={childrens} pagination={false} />
    );
  };

  const columns = [
    {
      title: t(`actions`),
      dataIndex: "actions",
      render: (text, row) => {
        return (
          <Popconfirm
            title="Are you sure to delete this?"
            onConfirm={() => confirmAll(row)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip placement="bottom" title="წაშლა">
              <Button
                shape="circle"
                icon={<DeleteOutlined style={{ color: "red" }} />}
              />
            </Tooltip>
          </Popconfirm>
        );
      },
    },
    {
      title: t(`fullName`),
      dataIndex: "name",
      render: (text, row) => {
        return row.key ? (
          <a onClick={() => openDraver(row)}>{row.name} </a>
        ) : (
          <p>{row.name}</p>
        );
      },
    },
    // {
    //   title: t(`calculateDate`),
    //   dataIndex: "calculationDate",
    // },
    {
      title: "Gross",
      dataIndex: "gross",
      render: (text, row) => <p> {row.gross}</p>,
    },
    {
      title: "Net",
      dataIndex: "net",
      render: (text, row) => <p>{row.net} </p>,
    },
    {
      title: "Paid",
      dataIndex: "paid",
      render: (text, row) => <p>{row.paid}</p>,
    },
    {
      title: "IncomeTax",
      dataIndex: "incomeTax",
      render: (text, row) => <p>{row.incomeTax}</p>,
    },
    {
      title: "PensionTax",
      dataIndex: "PensionTax",
      render: (text, row) => <p>{row.pensionTax} </p>,
    },
    {
      title: "Deduction",
      dataIndex: "Deduction",
      render: (text, row) => <p>{row.deduction} </p>,
    },
    {
      title: t(`RemainingGraceAmount`),
      dataIndex: "remainingGraceAmount",
      render: (text, row) => <p>{row.remainingGraceAmount} </p>,
    },
    // {
    //   title: "Debit",
    //   dataIndex: "Debit",
    //   render: (text, row) => <p> </p>,
    // },
    {
      title: t(`totalBalance`),
      dataIndex: "TotalBalance",
      render: (text, row) => <p> {row.totalBalance}</p>,
    },
  ];

  const [searchLoading, setSearchLoading] = useState(false);
  const [calculations, setCalculations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filter, setFilter] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [calculationDate, setCalculationDate] = useState(null);
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);
  const [drawerId, setDrawerId] = useState("");

  const useLocationSearch = useLocation();

  let history = useHistory();

  useEffect(() => {
    if (useLocationSearch.search) {
      console.log("useLocationSearch.search", useLocationSearch.search);
      const urlParams = new URLSearchParams(window.location.search);

      console.log("urlParamsurlParams", urlParams);
      const firstName = urlParams.get("firstName");
      const lastName = urlParams.get("lastName");
      const departmentId = urlParams.getAll("departmentId");
      const calculationPeriod = urlParams.getAll("calculationPeriod");
      console.log("departmentId", departmentId);
      console.log("lastName", lastName);
      let filterData = {
        firstName: firstName,
        lastName: lastName,
        departmentId: departmentId,
        calculationPeriod: calculationPeriod,
      };
      // history.push({ pathname: `${HOME_PAGE}/calculate`,search: `?${qs.stringify(filterData)}` });
      setFilter(filterData);
      search(filterData);
    }
  }, []);

  useEffect(() => {
    console.log("filter useef", filter, qs.stringify(filter));
    let params = new URLSearchParams();

    for (const [key, value] of Object.entries(filter)) {
      console.log("www", key, value);
      if (Array.isArray(value)) {
        value.forEach((element) => {
          params.append(key, element);
        });
      } else {
        params.append(key, value);
      }
    }

    console.log("paramsparams", params);
    console.log("getalll", params.getAll("departmentId")); //Prints ["1","4"].

    history.push({
      pathname: `${HOME_PAGE}/calculate`,
      search: `?${params}`,
    });
  }, [filter]);

  const showCalculationModal = () => {
    setIsModalVisible(true);
  };
  const fetchDepartments = async () => {
    const result = await axios(constants.API_PREFIX + "/api/department");

    console.log("result EmployeeTypes---", result.data);
    setDepartments(result.data);
  };

  useEffect(() => {
    console.log("user from context ", user);
    fetchDepartments();
    fetchComponents();
    fetchCurrencies();
  }, []);

  const [calculateLoading, setCalculateLoading] = useState(false);
  const handleOk = async () => {
    setCalculateLoading(true);
    const result = await axios.post(
      constants.API_PREFIX + `/api/Calculation/calculate/${calculationDate}`,
      filter
    );

    console.log("result calculation---", result.data);

    if (result.data.isSuccess) {
      search();
      setIsModalVisible(false);
      message.success("This is a success message");
      setCalculateLoading(false);
    } else {
      message.error(result.data.message);
      setCalculateLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getToTalBalance = (items) => {
    let paids = 0;
    console.log("itemsitems", items);
    items.forEach((element) => {
      if (
        element.employeeComponent?.component?.name
          .toLowerCase()
          .includes("paid")
      ) {
        paids += element.paid;
      }
    });

    console.log("paidspaids,paids", paids);
    return sumBy(items, (r) => r.net)?.toFixed(2) + paids;
  };

  const search = async (data) => {
    console.log("sppp", useLocationSearch);
    setSearchLoading(true);
    let filterData = filter;

    if (data) {
      filterData = data;
    }
    console.log("filter12", data, filterData);
    filterData.name = filterData.firstName
    const result = await axios(
      constants.API_PREFIX + "/api/Employee/GetEmployeeByCalculationFilter",
      { params: filterData, paramsSerializer: (params) => qs.stringify(params) }
    );
    console.log("result980", result.data);

    let mapedData = result.data.map((r) => ({
      key: r.id,
      gross: sumBy(r.calculations, (r) => r.gross)?.toFixed(2)?? '',
      net: sumBy(r.calculations, (r) => r.net)?.toFixed(2),
      paid: sumBy(r.calculations, (r) => r.paid)?.toFixed(2),
      incomeTax: sumBy(r.calculations, (r) => r.incomeTax)?.toFixed(2),
      pensionTax: sumBy(r.calculations, (r) => r.pensionTax)?.toFixed(2),
      remainingGraceAmount: r.remainingGraceAmount,
      totalBalance: getToTalBalance(r.calculations), //
      name: `${r.firstName} ${r.lastName}`,
      deduction: sumBy(r.calculations, (r) =>
        r.employeeComponent?.component.type == 2 ? r.net : 0
      )?.toFixed(2), //დაკავება
      childrens: r.calculations.map((c) => ({
        id: c.id,
        gross: c.gross,
        net: c.net,
        paid: c.paid,
        incomeTax: c.incomeTax,
        pensionTax: c.pensionTax,
        calculationDate: moment(c.calculationDate).format("YYYY-MM-DD"),
        name: c.employeeComponent?.componentName ?? c.compCode,
        remainingGraceAmount: c.remainingGraceAmount,
        // totalBalance: r.totalBalance,
      })),
    }));

    mapedData.forEach((element) => {
      element.childrens = orderBy(
        element.childrens,
        ["calculationDate"],
        ["asc"]
      );
    });
    console.log("ordered", mapedData);

    setCalculations(mapedData);
    setSearchLoading(false);
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;

    setFilter({ ...filter, [name]: value });
  };

  const onChangeCalculationPeriod = (date, dateString) => {
    console.log(date, dateString);
    setFilter({ ...filter, ["calculationPeriod"]: dateString });
  };

  const onChangeCalculationDate = (date, dateString) => {
    console.log(date, dateString);
    setCalculationDate(dateString);
  };

  const openDraver = (row) => {
    setVisibleDrawer(true);
    console.log("openDraver", row);
    console.log("openDraver122");
    setDrawerId(row.key);
  };

  const handleClickExport = async () => {
    setExcelLoading(true);

    let response = await axios(
      constants.API_PREFIX + `/api/Calculation/generateExcel`,
      {
        params: filter,
        responseType: "blob",
        paramsSerializer: (params) => qs.stringify(params),
      }
    );

    console.log("-444444444", response);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    var currentDate = new Date().toLocaleDateString();
    link.setAttribute("download", "Export " + currentDate + ".xlsx"); //or any other extension
    document.body.appendChild(link);
    link.click();

    setExcelLoading(false);
  };

  const props = {
    name: "file",
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
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

  const showModalAddComp = () => {
    setIsModalOpen(true);
  };

  const [addComponentCalculation, setAddComponentCalculation] = useState(false);
  const handleOkAddComp = async () => {
    console.log("asasas", importData);
    setAddComponentCalculation(true);
    const result = await axios.post(
      constants.API_PREFIX +
        `/api/Calculation/addCalculation/${importData.calculationDate}/${importData.componentId}/${importData.amount}/${importData.currency}`,
      filter
    );

    console.log("result calculation---", result.data);

    if (result.data.isSuccess) {
      search();
      setIsModalVisible(false);
      message.success("This is a success message");
      setAddComponentCalculation(false);
    } else {
      message.error(result.data.message);
      setAddComponentCalculation(false);
    }
    setIsModalOpen(false);
  };

  const handleCancelAddComp = () => {
    setIsModalOpen(false);
  };

  const [components, setComponents] = useState([]);

  const fetchComponents = async () => {
    const result = await axios(
      constants.API_PREFIX + "/api/Component/getAllActive"
    );

    setComponents(result.data);
  };

  const fetchCurrencies = async () => {
    // setTableLoading(true);
    const result = await axios(constants.API_PREFIX + "/api/Common/currencies");

    setCurrencyList(result.data);
    // setTableLoading(false);
  };

  const [currencyList, setCurrencyList] = useState([]);

  const [importData, setImportData] = useState({
    paidPeriod: null,
    paidDate: null,
    componentId: null,
    persons: [],
  });

  const handleChangeForm = (value, name) => {
    setImportData({ ...importData, [name]: value });
    console.log("------", value, name);
  };

  const handleChangeFormDate = (value, name) => {
    // setImportData({ ...importData, [name]: value });
    console.log("------", value, name);
    setImportData({ ...importData, ["calculationDate"]: name });
  };

  const handleChangeFormInput = (e) => {
    setImportData({ ...importData, ["amount"]: e.target.value });
  };


  const confirmDeleteCalculations = async (e) => {
    console.log("record",  filter);
    const result = await axios.delete(
      constants.API_PREFIX + `/api/Calculation/deleteCalculationsByFiler`,
      { params: filter, paramsSerializer: (params) => qs.stringify(params) }
    );
    console.log("result", result);
    if (result.data.isSuccess) {
      message.success(result.data.message);
      search();
    } else {
      message.error(result.data.message);
    }
  };
  
  const cancelDeleteCalculations = (e) => {
    console.log(e);
    message.error('Click on No');
  };

  console.log("ught runtime error");
  return (
    <div>
      <MyDrawer
        visibleDrawer={visibleDrawer}
        setVisibleDrawer={setVisibleDrawer}
        drawerId={drawerId}
      />

      <Row gutter={[16, 24]}>
        <Col span={4}>
          <Input
            onChange={handleChangeInput}
            value={filter?.firstName}
            name="firstName"
            placeholder={t(`firstName / lasttname`)}
          />
        </Col>
        {/* <Col span={4}>
          <Input
            onChange={handleChangeInput}
            value={filter.lastName}
            name="lastName"
            // placeholder="lastName"
            placeholder={t(`placeholderLastName`)}
          />
        </Col> */}
        <Col span={4}>
          <Select
            // defaultValue="აირჩიეთ"
            placeholder={t(`placeholderChoose`)}
            style={{ width: "100%" }}
            value={filter.departmentId}
            onChange={(e) => setFilter({ ...filter, departmentId: e })}
            allowClear
            mode="multiple"
            filterOption={(input, option) =>
              // console.log('optionoptionoption',input,option)
              (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
            }
          >
            {departments.map((i) => (
              <Option value={i.id}>{i.name}</Option>
            ))}
          </Select>
        </Col>
        <Col span={4}>
          <DatePicker
            onChange={onChangeCalculationPeriod}
            picker="month"
            placeholder={t(`placeholderSelectMonth`)}
          />
        </Col>

        <Col span={4}>
          <Button
            loading={searchLoading}
            onClick={() => search()}
            type="primary"
            icon={<SearchOutlined />}
          >
            {t(`buttonSeach`)}
          </Button>
        </Col>
      </Row>
      <br />
      <Row gutter={[16, 24]}>
        <Col span={4}></Col>
      </Row>
      <br />
      <br />
      <Space>
        {!user.roles.analyst ? (
          <>
            <Button
              loading={searchLoading}
              onClick={showCalculationModal}
              icon={<CalculatorOutlined />}
            >
              {t(`calculate`)}
            </Button>
            <Button
              loading={excelLoading}
              onClick={handleClickExport}
              icon={<FileExcelOutlined />}
            >
              {t(`export`)}
            </Button>
          </>
        ) : (
          ""
        )}

        <Modal
          // title="კალკულაცია"
          title={t(`calculate`)}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText={t(`okText`)}
          cancelText={t(`cancelText`)}
          okButtonProps={{ loading: calculateLoading }}
        >
          <Row gutter={[16, 24]}>
            <Col span={8}></Col>
            <Col span={8}>
              <DatePicker
                onChange={onChangeCalculationDate}
                placeholder={t(`Select Date`)}
              />
            </Col>
            <Col span={8}></Col>
          </Row>
        </Modal>
      </Space>
      <Button
        style={{ marginLeft: 15 }}
        type="primary"
        onClick={showModalAddComp}
      >
        Add Component
      </Button>
      
      <Popconfirm
        title="Are you sure to delete this calculations?"
        onConfirm={confirmDeleteCalculations}
        onCancel={cancelDeleteCalculations}
        okText="Yes"
        cancelText="No"
      >
        <Button icon={<DeleteOutlined />} style={{ marginLeft: 15 }} danger>Delete Calculations</Button>
      </Popconfirm>
      <Modal
        title="Add Component"
        open={isModalOpen}
        onOk={handleOkAddComp}
        onCancel={handleCancelAddComp}
        width={600}
        okButtonProps={{ loading: addComponentCalculation }}
      >
        <div>
          <Select
            defaultValue="Component"
            onChange={(value) => handleChangeForm(value, "componentId")}
            style={{ width: "249px" }}
          >
            {components.map((i) => (
              <Option value={i.id}>{i.name}</Option>
            ))}
          </Select>

          <DatePicker
            style={{ marginLeft: 13, width: "249px" }}
            onChange={handleChangeFormDate}
            placeholder={t(`Select Date`)}
          />
        </div>

        <div>
          <Select
            defaultValue="Currency"
            style={{ width: 249, marginTop: 15 }}
            onChange={(value) => handleChangeForm(value, "currency")}
          >
            {currencyList.map((i) => (
              <Option value={i.id}>{i.currency1}</Option>
            ))}
          </Select>

          <Input
            onChange={handleChangeFormInput}
            style={{ width: 249, marginLeft: 15 }}
            placeholder="Amount"
          />
        </div>
      </Modal>

      <br />
      <br />

      {/* <UploadCalculations /> */}
      <Button onClick={() => history.push('calculateFromFile')} style={{marginBottom: 16}} icon={<UploadOutlined />}>Add calculation from file</Button>
      <Table
        columns={columns}
        dataSource={calculations}
        expandable={{
          expandedRowRender,
          rowExpandable: (record) => record.childrens?.length,
        }}
        // scroll={{ x: 200 }}
      />
    </div>
  );
}

export default Calculate;
