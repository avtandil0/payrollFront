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

const columns = [
  {
    title: "Res_id",
    dataIndex: "resId",
    key: "res_id",
  },
  {
    title: "PersonalNumber",
    dataIndex: "personalNumber",
    key: "personalNumber",
    render: (text) => <>{text}</>,
  },
  {
    title: "FirstName",
    dataIndex: "firstName",
    key: "firstName",
  },
  {
    title: "LastName",
    dataIndex: "lastName",
    key: "lastName",
  },
  {
    title: "Address",
    dataIndex: "address1",
    key: "address1",
  },

  {
    title: "Calculation Date",
    dataIndex: "calculationDate",
    key: "calculationDate",
    render: (text) => <>{moment(text).format("YYYY-MM-DD")}</>,
  },
  {
    title: "Issued Amount",
    dataIndex: "issuedAmount",
    key: "issuedAmount",
  },
  {
    title: "Grace Value",
    dataIndex: "remainingGrace",
    key: "remainingGrace",
  },
  {
    title: "Income Tax",
    dataIndex: "incomeTax",
    key: "incomeTax",
  },
];
const data = [];
const Declaration = () => {
  const [form] = Form.useForm();

  const [declarationData, setDeclarationData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  const fetchData = async (year, month) => {
    console.log(233, form.getFieldValue('monthYear')?.year())
    setTableLoading(true);
    const result = await axios(
      constants.API_PREFIX + "/api/Calculation/GetDeclaration",
      {
        params: {
          year: year ?? form.getFieldValue('monthYear')?.year(),
          month: month ? month + 1 : form.getFieldValue('monthYear')?.month() + 1,
        },
      }
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

  useEffect(() => {
    // fetchData(moment(new Date()).year(), moment(new Date()).month());
  }, []);
  const executeCalculation = async () => {
    //calculateForDeclaration
    const result = await axios.post(
      constants.API_PREFIX + "/api/Calculation/calculateForDeclaration"
    );
    console.log("result", result);
    if (result.data.isSuccess) {
      message.success(result.data.message);
      // fetchData();
    } else {
      message.error(result.data.message);
    }
  };


  const executeDeleteAndCalculate = async () => {
    //calculateForDeclaration
    const result = await axios.post(
      constants.API_PREFIX + "/api/Calculation/deleteAndCalculateForDeclaration"
    );
    console.log("result", result);
    if (result.data.isSuccess) {
      message.success(result.data.message);
      // fetchData();
    } else {
      message.error(result.data.message);
    }
  };

  const onChange = () => {
    form.submit();
  };
  return (
    <>
      <Form
        form={form}
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="inline"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Form.Item name="monthYear">
          <DatePicker
            style={{ width: 240 }}
            onChange={onChange}
            picker="month"
          />
        </Form.Item>

        {/* <Form.Item label="period" name="period">
        <Select
            style={{ width: 120 }}
            options={monthOptions}
          />
        </Form.Item> */}

        {/* <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
            Search
          </Button>
        </Form.Item> */}
      </Form>

      <br />
      <Button onClick={executeCalculation} icon={<TableOutlined />}>
        Calculate
      </Button>
      <Button  style={{marginLeft: 15}} type="dashed" danger  onClick={executeDeleteAndCalculate} icon={<TableOutlined />}>
        delete and calculate
      </Button>
      <br />
      <br />

      <Table
        loading={tableLoading}
        columns={columns}
        dataSource={declarationData}
      />
    </>
  );
};
export default Declaration;
