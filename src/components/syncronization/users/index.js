import React, { useState, useEffect } from "react";
import { Table, Radio, Divider } from "antd";
import moment from "moment";

import "antd/dist/antd.css";
import {
  Modal,
  Button,
  message,
  Form,
  Input,
  Space,
  Popconfirm,
  Tooltip,
} from "antd";
import {
  PlusCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  SyncOutlined
} from "@ant-design/icons";
import axios from "axios";
import constants from "../../../constant";
import { useTranslation } from "react-i18next";

import { Select } from "antd";

const { Option } = Select;

function Humres() {
  const { t } = useTranslation();
  const [roles, setRoles] = useState([]);

  const disabledDelete = (record) => {
    console.log("disabledDelete", record, roles);
    // let admin = roles.find((r) => r.name.toLowerCase() == "admin");
    // console.log("adminadminadmin", record.userClaimTypes.includes(admin?.id));
    // if (record.userClaimTypes.includes(admin.id)) {
    //   return true;
    // }
    return false;
  };

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
            <Tooltip placement="bottom" title="რედაქტირება">
              <Button
                onClick={() => syncData(record)}
                type="primary"
                icon={<SyncOutlined />}
              />
            </Tooltip>
          </Space>
        </div>
      ),
    },
    {
      title: t(`resId`),
      dataIndex: "resId",
    },
    {
      title: t(`fieldName`),
      dataIndex: "fieldName",
    },
    {
      title: t(`oldValue`),
      dataIndex: "oldValue",
    },
    {
      title: t(`newValue`),
      dataIndex: "newValue",
    },
   

    {
      title: t(`dateOfCreation`),
      dataIndex: "dateCreated",
      render: (text) => <p>{moment(text).format("YYYY-MM-DD")}</p>,
    },
  ];

  const [dataSaveArray, setDataSaveArray] = useState([]);
  const [costCenter, setCostCenter] = useState({
    code: "",
    description: "",
  });
  const [user, setUser] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    email: "",
    role: "",
  });

  const [tableLoading, setTableLoading] = useState(false);
  const [isEdiT, setIsEdiT] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchData = async () => {
    setTableLoading(true);
    let token = localStorage.getItem("payrollAppLogintoken");
    axios.defaults.headers.common = { Authorization: `Bearer ${token}` };
    const result = await axios(
      constants.API_PREFIX + "/api/audit/getAllHumresAudit"
    );
    console.log("result", result.data);

    setDataSaveArray(result.data);
    setTableLoading(false);
  };

  const fetchRoles = async () => {
    const result = await axios(
      constants.API_PREFIX + "/api/Common/UserClaimTypes"
    );
    console.log("result", result);
    setRoles(result.data);
  };

  useEffect(() => {
    fetchRoles();
    fetchData();
  }, []);

  const showModal = () => {
    setUser({})
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    setIsModalVisible(false);
    setIsEdiT(false);
    console.log("user", user);
    if (!isEdiT) {
      const result = await axios.post(
        constants.API_PREFIX + "/api/Account/registerUser",
        user
      );
      console.log("result", result);
      if (result.data.isSuccess) {
        fetchData();
        message.success(result.data.message);
      } else {
        message.error(result.data.message);
      }
    } else {
      const result1 = await axios.post(
        constants.API_PREFIX + "/api/Account/update",
        user
      );
      console.log("result1", result1);
      if (result1.data.isSuccess) {
        fetchData();
        message.success(result1.data.message);
      } else {
        message.error(result1.data.message);
      }
    }
    setCostCenter({
      code: "",
      description: "",
    });
  };

  const handleCancel = () => {
    setIsEdiT(false);
    setIsModalVisible(false);
    setCostCenter({
      code: "",
      description: "",
    });
  };

  const handleChange = (e) => {
    // console.log('handleChange', e.target);
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleChangeSelect = (id) => {
    setUser({ ...user, ["role"]: id });
  };

  const syncData = async (record) => {
    console.log("record", record);
    const result = await axios.put(
      constants.API_PREFIX + "/api/audit/updateEmployee",
      record
    );
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
    setUser({ ...record, role: record.userClaimTypes[0] });
    setIsModalVisible(true);
  };

  return (
    <div>
      <Button type="primary" onClick={showModal} icon={<PlusCircleOutlined />}>
        {t(`add`)}
      </Button>
      <Modal
        loading={buttonLoading}
        okText={!isEdiT ? "დამატება" : "შენახვა"}
        cancelText={t(`cancelText`)}
        title={t(`user`)}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
      >
        <Form>
          <Form.Item>
            <Form.Item
              label={t(`userName`)}
              rules={[{ required: true }]}
              style={{ display: "inline-block", width: "calc(50% - 8px)" }}
            >
              <Input
                value={user.userName}
                type="text"
                name="userName"
                onChange={(e) => handleChange(e)}
                placeholder={t(`userName`)}
                disabled={isEdiT}
              />
            </Form.Item>

            <Form.Item
              label={t(`firstName`)}
              rules={[{ required: true }]}
              style={{
                display: "inline-block",
                width: "calc(50% - 8px)",
                marginLeft: "10px",
              }}
            >
              <Input
                value={user.firstName}
                type="text"
                name="firstName"
                onChange={(e) => handleChange(e)}
                placeholder={t(`firstName`)}
              />
            </Form.Item>
            <Form.Item
              label={t(`lastName`)}
              rules={[{ required: true }]}
              style={{ display: "inline-block", width: "calc(50% - 8px)" }}
            >
              <Input
                value={user.lastName}
                type="text"
                name="lastName"
                onChange={(e) => handleChange(e)}
                placeholder={t(`lastName`)}
              />
            </Form.Item>

            <Form.Item
              label={t(`phoneNumber`)}
              rules={[{ required: true }]}
              style={{
                display: "inline-block",
                width: "calc(50% - 8px)",
                marginLeft: "10px",
              }}
            >
              <Input
                value={user.phoneNumber}
                type="text"
                name="phoneNumber"
                onChange={(e) => handleChange(e)}
                placeholder={t(`phoneNumber`)}
              />
            </Form.Item>
            <Form.Item
              label={t(`address`)}
              rules={[{ required: true }]}
              style={{ display: "inline-block", width: "calc(50% - 8px)" }}
            >
              <Input
                value={user.address}
                type="text"
                name="address"
                onChange={(e) => handleChange(e)}
                placeholder={t(`address`)}
              />
            </Form.Item>

            <Form.Item
              label={t(`role`)}
              rules={[{ required: true }]}
              style={{
                display: "inline-block",
                width: "120px",
                marginLeft: "10px",
              }}
            >
              <Select
                value={user.role}
                style={{ width: 280 }}
                onChange={handleChangeSelect}
              >
                {roles.map((r) => {
                  return (
                    <Option value={r.id} key={r.id}>
                      {r.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>

      <Divider />

      <Table
        loading={tableLoading}
        columns={columns}
        dataSource={dataSaveArray}
      />
    </div>
  );
}

export default Humres;
