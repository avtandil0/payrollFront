import React, { useState, useEffect, useContext } from "react";
import "antd/dist/antd.css";
import { Button, Form, Input,Select } from "antd";
import { PlusCircleOutlined, ImportOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { HOME_PAGE } from "../../constant";
import ImportEmployee from "./ImportEmployee";
import EmployeeTable from "./EmployeeTable";
import axios from "axios";
import constants from "../../constant";
import { useTranslation } from "react-i18next";
import { UserContext } from "../../appContext";
import qs from "qs";

const { Option } = Select;

function Employee() {
  const { user } = useContext(UserContext);

  const { t } = useTranslation();

  const [dataSaveArray, setDataSaveArray] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  let history = useHistory();

  const add = () => {
    history.push(`${HOME_PAGE}/Employee/Add`);
  };

  const fetchData = async (filter) => {
    setLoading(true);
    const result = await axios(constants.API_PREFIX + "/api/Employee",{
      params: filter,
      paramsSerializer: (params) => qs.stringify(params) 
    });
    console.log("result1", result);
    setDataSaveArray(result.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log(values);
    fetchData(values);
  };
  const [departments, setDepartments] = useState([]);
  const fetchDepartments = async () => {
    const result = await axios(constants.API_PREFIX + "/api/department");

    console.log("result EmployeeTypes---", result.data);
    setDepartments(result.data);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div>
      <Form layout={"inline"} form={form} onFinish={onFinish}>
        <Form.Item name="resId" label="resId" style={{ width: 200 }}>
          <Input placeholder="input placeholder" />
        </Form.Item>
        <Form.Item
          name="name"
          label="firstname/ lastName"
          style={{ width: 200 }}
        >
          <Input placeholder="input placeholder" />
        </Form.Item>
        <Form.Item name="departments" label="department" style={{ width: 300 }}>
          <Select
            // defaultValue="აირჩიეთ"
            placeholder={t(`placeholderChoose`)}
            allowClear
            style={{ width: 300 }}
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
        </Form.Item>
        
        <Form.Item>
          <Button htmlType="submit" style={{ marginTop: 30 }}>
            Search
          </Button>
        </Form.Item>
      </Form>

      <br />
      <br />
      {!user.roles.analyst ? (
        <>
          {" "}
          <Button type="primary" onClick={add} icon={<PlusCircleOutlined />}>
            {t(`add`)}
          </Button>
          <Button
            style={{ marginLeft: "10px" }}
            onClick={showModal}
            icon={<ImportOutlined />}
            type="primary"
          >
            {t(`import`)}
          </Button>
        </>
      ) : (
        ""
      )}

      {/* <Divider /> */}

      <br />
      <br />
      <ImportEmployee
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        fetchData={fetchData}
      />

      <EmployeeTable
        loading={loading}
        showDelete={true}
        employeeArray={dataSaveArray}
        fetchData={fetchData}
      />
    </div>
  );
}

export default Employee;
