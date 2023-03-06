import React, { useState, useEffect, useContext } from "react";
import { Form, Space, Table, Tag, Input, Button,message } from "antd";
import { SearchOutlined,TableOutlined } from "@ant-design/icons";
import axios from "axios";
import constants from "../../constant";

const onFinish = (values) => {
  console.log("Success:", values);
};
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const columns = [
  {
    title: "res_id",
    dataIndex: "resId",
    key: "res_id",
  },
  {
    title: "personalNumber",
    dataIndex: "personalNumber",
    key: "personalNumber",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "firstName",
    dataIndex: "firstName",
    key: "firstName",
  },
  {
    title: "lastName",
    dataIndex: "lastName",
    key: "lastName",
  },
  {
    title: "payrollYear",
    dataIndex: "payrollYear",
    key: "payrollYear",
  },

  {
    title: "period",
    dataIndex: "period",
    key: "period",
  },
  {
    title: "calculationDate",
    dataIndex: "calculationDate",
    key: "calculationDate",
  },
  {
    title: "comp_code",
    dataIndex: "compCode",
    key: "comp_code",
  },
  {
    title: "base_value",
    dataIndex: "baseValue",
    key: "base_value",
  },
  {
    title: "issued_amount",
    dataIndex: "issuedAmount",
    key: "issued_amount",
  },
  {
    title: "grace_value",
    dataIndex: "graceValue",
    key: "grace_value",
  },
  {
    title: "income_tax",
    dataIndex: "incomeTax",
    key: "income_tax",
  },
];
const data = [];
const Declaration = () => {

  const [declarationData, setDeclarationData] = useState([])
  const [tableLoading, setTableLoading] = useState(false);

  const fetchData = async () => {
    setTableLoading(true);
    const result = await axios(constants.API_PREFIX + "/api/Calculation/GetDeclaration");
    console.log("result", result.data);

    setDeclarationData(result.data);
    setTableLoading(false);
  }

  useEffect(() => {
    fetchData();
  },[])
  const executeCalculation = async () => {
    //calculateForDeclaration
    const result = await axios.post(
      constants.API_PREFIX + "/api/Calculation/calculateForDeclaration",
    );
    console.log("result", result);
    if (result.data.isSuccess) {
      message.success(result.data.message);
      fetchData();
    } else {
      message.error(result.data.message);
    }
  }
  return (
    <>
      <Form
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
      >
        <Form.Item label="year" name="year">
          <Input />
        </Form.Item>

        <Form.Item label="period" name="period">
          <Input />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
            Search
          </Button>
        </Form.Item>
      </Form>

      <br />
      <br />
      <Button onClick={executeCalculation} icon={<TableOutlined />}>Calculate</Button>
      <br />
      <br />

      <Table loading={tableLoading} columns={columns} dataSource={declarationData} />
    </>
  );
};
export default Declaration;
