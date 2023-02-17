import { Form, Space, Table, Tag, Input, Button } from "antd";
import { SearchOutlined } from '@ant-design/icons';

const onFinish = (values) => {
  console.log("Success:", values);
};
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const columns = [
  {
    title: "res_id",
    dataIndex: "res_id",
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
    dataIndex: "comp_code",
    key: "comp_code",
  },
  {
    title: "base_value",
    dataIndex: "base_value",
    key: "base_value",
  },
  {
    title: "issued_amount",
    dataIndex: "issued_amount",
    key: "issued_amount",
  },
  {
    title: "grace_value",
    dataIndex: "grace_value",
    key: "grace_value",
  },
  {
    title: "income_tax",
    dataIndex: "income_tax",
    key: "income_tax",
  },

];
const data = [

];
const Declaration = () => {
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
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="inline"
      >
        <Form.Item
          label="year"
          name="year"

        >
          <Input />
        </Form.Item>

        <Form.Item
          label="period"
          name="period"

        >
          <Input />
        </Form.Item>



        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit"  icon={<SearchOutlined />}>
            Search
          </Button>
        </Form.Item>
      </Form>

<br />
<br />
<Button>Calculate</Button>
<br />
<br />

      <Table columns={columns} dataSource={data} />
    </>
  );
};
export default Declaration;
