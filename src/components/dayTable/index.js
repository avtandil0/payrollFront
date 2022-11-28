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
  Select,
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
import groupBy from "lodash/groupBy";

const { Option } = Select;

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
      title: t(`sheetId`),
      dataIndex: "sheetId",
    },
    {
      title: t(`name`),
      dataIndex: "name",
    },

    {
      title: t(`dateCreated`),
      dataIndex: "dateCreated",
      render: (text) => <p>{moment(text).format("YYYY-MM-DD")}</p>,
    },
  ];

  const [dataSaveArray, setDataSaveArray] = useState([]);
  const [name, setName] = useState("");
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
    const result = await axios(constants.API_PREFIX + "/api/TimeSheet");
    let groupedData = groupBy(result.data, (r) => {
      return r.sheetId;
    });
    console.log("result", groupedData);

    let target = [];
    for (const [key, value] of Object.entries(groupedData)) {
      console.log(888, `${key}--- ${value}`);
      target.push({
        sheetId: key,
        name: value[0]?.name,
        dateCreated: value[0]?.dateCreated,
        child: value,
      });
    }

    console.log("targettargettarget", target);
    setDataSaveArray(target);
    setTableLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showModal = () => {
    setName('')
    setShiftData([])
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

  const [shiftData, setShiftData] = useState([]);
  const clickEdit = (record) => {
    setIsEdiT(true);
    console.log("clickEdit", record);
    // setProject(record);
    setShiftData(record.child);

    setName(record.name);
    setIsModalVisible(true);
  };

  const format = "HH:mm";

  const handleSubmit = async (data) => {
    console.log("dataaaaa", data);
    let postData = [];
    for (const [key, value] of Object.entries(data)) {
      console.log(`${key}: ${value}`);
      if (value.workingTime && value.breakingTime) {
        postData.push({
          id: value.id,
          name: name,
          weekDay: value.weekDay? value.weekDay: key,
          sheetId: value.sheetId,
          workingStartTime: value.workingTime[0].format(format),
          workingEndTime: value.workingTime[1].format(format),
          breakingStartTime: value.breakingTime[0].format(format),
          breakingEndTime: value.breakingTime[1].format(format),
        });
      }
    }

    if (isEdiT) {
      console.log("ediiit", name, data);
      const result1 = await axios.put(
        constants.API_PREFIX + "/api/TimeSheet",
        {
          timeSheets: postData,
          name: name,
          sheetId: shiftData[0].sheetId
        }
      );

      setIsModalVisible(false);
      fetchData();
      return;
    }

    console.log("postDatapostData", postData);

    const result = await axios.post(
      constants.API_PREFIX + "/api/TimeSheet",
      postData
    );

    setIsModalVisible(false);
    fetchData();
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
        width={800}
        footer={null}
      >
        <Input
          type="name"
          name="name"
          onChange={(e) => setName(e.target.value)}
          value={name}
          placeholder={t(`name`)}
        />
        <br />
        <br />
        <WorkingHours handleSubmit={handleSubmit} data={shiftData} />
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
