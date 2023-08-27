import React, { useState, useEffect, useContext } from "react";
import {
  Form,
  Space,
  Table,
  Tag,
  Input,
  Button,
  message,
  Select,
  DatePicker,
} from "antd";
import { SearchOutlined, TableOutlined } from "@ant-design/icons";
import axios from "axios";
import constants from "../../constant";
import moment from "moment";
import { sumBy,orderBy } from "lodash";
import { Col, Row } from "antd";
import { useTranslation } from "react-i18next";
import qs from "qs";

const { Option } = Select;


const yearsOptions = [];
for (let i = 2020; i < new Date().getFullYear(); i++) {
  yearsOptions.push({
    value: i,
    label: i,
  });
}

const monthOptions = [];
for (let i = 0; i < 12; i++) {
  monthOptions.push({
    value: i,
    label: i,
  });
}

const data = [];
const Report = () => {
  const [filter, setFilter] = useState({});
  const { t } = useTranslation();
  const [departments, setDepartments] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;

    setFilter({ ...filter, [name]: value });
  };

  const fetchDepartments = async () => {
    const result = await axios(constants.API_PREFIX + "/api/department");

    console.log("result EmployeeTypes---", result.data);
    setDepartments(result.data);
  };

  const [columns, setColumns] = useState([
    {
      title: "Res_id",
      dataIndex: "resId",
      key: "res_id",
      sorter: (a, b) => a.resId - b.resId,
    },
    {
      title: "პირადი ნომერი",
      dataIndex: "personalNumber",
      key: "personalNumber",
      render: (text) => <>{text}</>,
    },
    {
      title: "სახელი",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "გვარი",
      dataIndex: "lastName",
      key: "lastName",
    },
  ]);
  const [form] = Form.useForm();

  const [declarationData, setDeclarationData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  const fetchData = async (year, month) => {
    setTableLoading(true);
    const result = await axios(constants.API_PREFIX + "/api/Report/GetReport",
      // params: {
      //   year: year,
      //   month: month ? month + 1 : null,
      // },
      { params: filter, paramsSerializer: (params) => qs.stringify(params) }
    );
    console.log("result", result.data);

    setDeclarationData(result.data);
    setTableLoading(false);
  };

  const onFinish = (values) => {
    console.log("Success:", values);
    let year = values.monthYear.year();
    let month = values.monthYear.month();
    fetchData(year, month);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const renderCompValue = (id, record) => {
    console.log("texttext", id, record);
    let target = record.employeeComponents.find((r) => r.componentId == id);
    console.log("amount", target);
    return target?.amount;
  };

  const getActiveComp = (data) => {
    let currentDate = new Date();
    let activeComp = data.filter(
      (r) =>
        new Date(r.startDate) < currentDate && new Date(r.endDate) > currentDate
    );
    console.log("activeComp", data, activeComp);
    return activeComp;
  };
  const fetchComponents = async () => {
    const result = await axios(constants.API_PREFIX + "/api/Component");
    console.log("fetchComponentsfetchComponents", result.data);

    let comps = result.data.map((r) => {
      return {
        title: r.name,
        dataIndex: r.id,
        key: r.name,
        type: r.type,
        render: (text, record) => <>{renderCompValue(r.id, record)}</>,
      };
    });

    let sumAmount = 0;
    // result.data.forEach(r => {
    //   sumAmount += renderCompValue(r.id,r)
    // });

    let sum = {
      title: "Sum",
      dataIndex: "sum",
      key: "sum",
      render: (text, record) => (
        <>
          {sumBy(
            getActiveComp(record.employeeComponents),
            (r) => r.amount
          )?.toFixed(2)}
        </>
      ),
    };

    console.log("compscomps", comps);
    const ordered = orderBy(comps, ['type'])
    console.log("compscomps1", ordered);

    setColumns([...columns, ...ordered, sum]);
  };
  useEffect(() => {
    fetchDepartments();
    fetchComponents();
    fetchData(moment(new Date()).year(), moment(new Date()).month());
  }, []);
  const executeCalculation = async () => {
    //calculateForDeclaration
    const result = await axios.post(
      constants.API_PREFIX + "/api/Calculation/calculateForDeclaration"
    );
    console.log("result", result);
    if (result.data.isSuccess) {
      message.success(result.data.message);
      fetchData();
    } else {
      message.error(result.data.message);
    }
  };

  const onChange = () => {
    form.submit();
  };

  const onChangeCalculationPeriod = (date, dateString) => {
    console.log(date, dateString);
    setFilter({ ...filter, ["calculationPeriod"]: dateString });
  };

  const search = async () => {

    console.log("filter", filter);

    fetchData()
  };


  return (
    <>
      <br />
      {/* <Button onClick={executeCalculation} icon={<TableOutlined />}>
        Calculate
      </Button> */}
      <br />
      <Row gutter={[16, 24]}>
        <Col span={4}>
          <Input
            onChange={handleChangeInput}
            value={filter?.firstName}
            name="firstName"
            placeholder={t(`placeholderFirstName`)}
          />
        </Col>
        <Col span={4}>
          <Input
            onChange={handleChangeInput}
            value={filter.lastName}
            name="lastName"
            // placeholder="lastName"
            placeholder={t(`placeholderLastName`)}
          />
        </Col>
        <Col span={4}>
          <Select
            // defaultValue="აირჩიეთ"
            placeholder={t(`placeholderChoose`)}
            style={{ width: "100%" }}
            value={filter.departmentId}
            onChange={(e) => setFilter({ ...filter, departmentId: e })}
            allowClear
            mode="multiple"
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
            onClick={search}
            type="primary"
            icon={<SearchOutlined />}
          >
            {t(`buttonSeach`)}
          </Button>
        </Col>
      </Row>
      <br />

      <Table
        loading={tableLoading}
        columns={columns}
        dataSource={declarationData}
      />
    </>
  );
};
export default Report;
