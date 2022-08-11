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
import WorkingHours from "../employee/employeeDetails/WorkingHours";

function DayTable() {
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
      title: t(`code`),
      dataIndex: "code",
      render: (text) => <a>{text}</a>,
    },
    {
      title: t(`description`),
      dataIndex: "description",
    },
    {
      title: t(`dateOfCreation`),
      dataIndex: "dateCreated",
      render: (text) => <p>{moment(text).format("YYYY-MM-DD")}</p>,
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

  const fetchData = async () => {
    setTableLoading(true);
    const result = await axios(constants.API_PREFIX + "/api/Project");
    console.log("result", result.data);

    setDataSaveArray(result.data);
    setTableLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    setIsModalVisible(false);
    setIsEdiT(false);
    console.log("project", project);
    if (!isEdiT) {
      const result = await axios.post(
        constants.API_PREFIX + "/api/Project",
        project
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
    const result = await axios.delete(constants.API_PREFIX + "/api/Project", {
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
        title={t(`dayTable`)}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
      >
        <Input type="name" name="description" placeholder={t(`name`)} />
        <br/>
        <br/>
        <WorkingHours />
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

export default DayTable;
