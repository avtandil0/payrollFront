import React, { useState, useEffect, useContext } from "react";
import "antd/dist/antd.css";
import { Button } from "antd";
import { PlusCircleOutlined, ImportOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { HOME_PAGE } from "../../constant";
import ImportEmployee from "./ImportEmployee";
import EmployeeTable from "./EmployeeTable";
import axios from "axios";
import constants from "../../constant";
import { useTranslation } from "react-i18next";
import { UserContext } from "../../appContext";

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

  const fetchData = async () => {
    setLoading(true);
    const result = await axios(constants.API_PREFIX + "/api/Employee");
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

  return (
    <div>
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
