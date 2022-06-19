import React, { useState, useContext } from "react";
import { Table, Divider, Modal, Button, Form, Input, Select } from "antd";

import "antd/dist/antd.css";
import { PlusCircleOutlined } from "@ant-design/icons";
import { UserContext } from "../../appContext";

const { Option } = Select;

const columns = [
  {
    title: "id",
    dataIndex: "id",
  },
  {
    title: "კოდი",
    dataIndex: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "აღწერა",
    dataIndex: "project",
  },
  {
    title: "ტიპი",
    dataIndex: "coefficient",
  },
];

function AccountPlan() {
  const { user } = useContext(UserContext);

  const [saveDepartmentName, setSaveDepartmentName] = useState("");
  const [description, setDescription] = useState("");
  const [dataSaveArray, setDataSaveArray] = useState([
    {
      key: "1",
      id: 1,
      name: "ავანსი",
      project: 32,
      dateStart: "20/02/20",
      dateEnd: "20/02/21",
      coefficient: 100,
    },
    {
      key: "2",
      id: 2,
      name: "ხელფასი",
      project: 42,
      dateStart: "20/02/20",
      dateEnd: "20/02/21",
      coefficient: 200,
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const { TextArea } = Input;

  const handleOk = () => {
    setIsModalVisible(false);
    console.log(saveDepartmentName, " ", dataSaveArray);
    var newDepartment = {
      key: dataSaveArray.length + 1,
      id: dataSaveArray.length + 1,
      name: saveDepartmentName,
      project: description,
      // startDate: dataSaveArray.length + 1,
      // dateEnd: dataSaveArray.length + 1,
      coefficient: dataSaveArray.length + 1,
    };
    var c = [...dataSaveArray, newDepartment];
    setDataSaveArray([...dataSaveArray, newDepartment]);
    console.log("ccc", c);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  function inputChange(e) {
    console.log("inputChange", e.target.value);
    setSaveDepartmentName(e.target.value);
  }

  function inputDescription(e) {
    console.log("inputDescription", e.target.value);
    setDescription(e.target.value);
  }

  function handleChange(value) {
    console.log(`selected ${value}`);
  }
  return (
    <div>
      {!user.roles.analyst ? (
        <Button
          type="primary"
          onClick={showModal}
          icon={<PlusCircleOutlined />}
        >
          დამატება
        </Button>
      ) : (
        ""
      )}

      <Modal
        title="ანგარიშთა გეგმის ანგარიში"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        // width={1000}
      >
        <Form>
          <Form.Item style={{ marginBottom: 0 }}>
            <Form.Item
              onChange={(e) => inputChange(e)}
              label="კოდი"
              rules={[{ required: true }]}
              style={{ display: "inline-block", width: "calc(50% - 8px)" }}
            >
              <Input placeholder="კოდი" />
            </Form.Item>

            <Form.Item
              label="ტიპი"
              style={{
                display: "inline-block",
                width: "calc(50% - 8px)",
                margin: "-20 8px",
              }}
            >
              <Select
                defaultValue="test"
                style={{ width: 120 }}
                onChange={handleChange}
                style={{
                  display: "inline-block",
                  width: "calc(50% - 8px)",
                  margin: "-20 8px",
                }}
              >
                <Option value="asi">საბალანსო</Option>
                <Option value="orasi">მოგება</Option>
                <Option value="samasi">ზარალი</Option>
              </Select>
            </Form.Item>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            {/* <Form.Item
              label="აღწერა"
              rules={[{ required: true }]}
              style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
            >
              <Input placeholder="აღწერა" />
            </Form.Item> */}

            <TextArea
              placeholder="აღწერა..."
              onChange={(e) => inputDescription(e)}
              rows={4}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Divider />

      <Table
        // rowSelection={{
        //   type: selectionType,
        //   ...rowSelection,
        // }}
        columns={columns}
        dataSource={dataSaveArray}
      />
    </div>
  );
}

export default AccountPlan;
