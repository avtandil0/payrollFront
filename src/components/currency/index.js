import React, { useState, useEffect, useContext } from "react";
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
  Table,
  Divider,
  Tooltip,
  DatePicker,
  Select
} from "antd";
import {
  PlusCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import axios from "axios";
import constants from "../../constant";
import { useTranslation } from "react-i18next";
import { UserContext } from "../../appContext";

const { Option } = Select;

function Currency() {
  const { user } = useContext(UserContext);

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
            {/* <Tooltip placement="bottom" title="რედაქტირება">
              <Button
                onClick={() => clickEdit(record)}
                type="primary"
                icon={<EditOutlined />}
              />
            </Tooltip> */}
          </Space>
        </div>
      ),
    },
    {
      title: t(`date`),
      dataIndex: "date",
      render: (text) => <span>{ moment(text).format("YYYY-MM-DD")}</span>,
    },
    {
      title: t(`exchangeRate`),
      dataIndex: "exchangeRate",
    },
    {
      title: t(`currency`),
      dataIndex: "currency",
      render: (text, record) => <span>{ record.currency.currency1}</span>,
    },
  ];

  const [dataSaveArray, setDataSaveArray] = useState([]);
  const [project, setProject] = useState({
    code: "",
    description: "",
  });
  const [tableLoading, setTableLoading] = useState(false);
  const [isEdiT, setIsEdiT] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currencyList, setCurrencyList] = useState([]);


  const fetchCurrencies = async () => {
    // setTableLoading(true);
    const result = await axios(
      constants.API_PREFIX + "/api/Common/currencies"
    );

    setCurrencyList(result.data);
    // setTableLoading(false);
  };

  const fetchData = async () => {
    setTableLoading(true);
    const result = await axios(constants.API_PREFIX + "/api/Rate");
    console.log("result8", result.data);

    setDataSaveArray(result.data);
    setTableLoading(false);
  };

  const handleChangeEmployeeComponentSelect = (value, name) => {
    setProject({ ...project, [name]: value });
    console.log("handleChangeEmployeeComponents", value);
  };


  useEffect(() => {
    fetchData();
    fetchCurrencies();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    setIsModalVisible(false);
    setIsEdiT(false);
    console.log("project", project);
    let data = {
      currencyId: project.currency,
      exchangeRate: parseFloat(project.exchangeRate),
      date: project.date
    }
    if (!isEdiT) {
      const result = await axios.post(
        constants.API_PREFIX + "/api/Rate",
        data
      );
      console.log("result", result);
      if (result.data.isSuccess) {
        fetchData();
        message.success(result.data.message);
      } else {
        message.error(result.data.message);
      }
    } else {
      const result1 = await axios.put(
        constants.API_PREFIX + "/api/Project",
        project
      );
      console.log("result1", result1);
      if (result1.data.isSuccess) {
        fetchData();
        message.success(result1.data.message);
      } else {
        message.error(result1.data.message);
      }
    }
    setProject({
      code: "",
      description: "",
    });
  };

  const handleCancel = () => {
    setIsEdiT(false);
    setIsModalVisible(false);
    setProject({
      code: "",
      description: "",
    });
  };

  const handleChange = (e) => {
    // console.log('handleChange', e.target);
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const confirm = async (record) => {
    console.log("record", record);
    const result = await axios.delete(constants.API_PREFIX + "/api/Rate", {
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
    setProject(record);
    setIsModalVisible(true);
  };

  const handleChangeDate =(value,dateString) => {
    console.log(value,dateString)
    setProject({...project, date: dateString})
  }

  return (
    <div>
      {!user.roles.analyst ? (
        <Button
          type="primary"
          onClick={showModal}
          icon={<PlusCircleOutlined />}
        >
          {t(`add`)}
        </Button>
      ) : (
        ""
      )}

      <Modal
        loading={buttonLoading}
        okText={!isEdiT ? "დამატება" : "შენახვა"}
        cancelText={t(`cancelText`)}
        title={t(`project`)}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        // width={1000}
      >
        <Form layout="vertical">
          <Form.Item>
            <Form.Item
              label={t(`currency`)}
              rules={[{ required: true }]}
              style={{ display: "inline-block", width: "calc(50% - 8px)" }}
            >

               <Select
                defaultValue="აირჩიეთ"
                style={{ width: 200, marginTop: 5 }}
                onChange={(value) =>
                  handleChangeEmployeeComponentSelect(value, "currency")
                }
              >
                {currencyList.map((i) => (
                  <Option value={i.id}>{i.currency1}</Option>
                ))}
              </Select>
            </Form.Item>

            {/* </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}> */}
            <Form.Item
              label={t(`exchange Rate`)}
              rules={[{ required: true }]}
              style={{
                display: "inline-block",
                width: "calc(50% - 8px)",
                marginLeft: "10px",
              }}
            >
              <Input
                value={project.exchangeRate}
                type="text"
                name="exchangeRate"
                onChange={(e) => handleChange(e)}
                placeholder={t(`description`)}
              />
            </Form.Item>

            <Form.Item
              label={t(`Date`)}

              rules={[{ required: true }]}
              style={{
                display: "inline-block",
                width: "calc(50% - 8px)",
                marginLeft: "10px",
              }}
            >
              <DatePicker
               name="date"
               onChange={handleChangeDate}/>
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

export default Currency;
