import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  Tooltip,
  Col,
  Input,
  Row,
  DatePicker,
  Select,
  Modal,
  Drawer,
  Divider
} from "antd";
import {
  CalculatorOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import constants from "../../constant";
import moment from "moment";
import { sumBy } from "lodash";
import "./index.css"
import { useTranslation } from "react-i18next";
import {
  Link
} from "react-router-dom"




const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);

function MyDrawer({ visibleDrawer, setVisibleDrawer, drawerId }) {

  const columns = [
    {
      title: 'componentName',
      dataIndex: 'componentName',
      key: 'componentName',
      render: text => <p>{text}</p>,
    },
    {
      title: 'costCenterCode',
      dataIndex: 'costCenterCode',
      key: 'costCenterCode',
    },
    {
      title: 'projectCode',
      dataIndex: 'projectCode',
      key: 'projectCode',
    },
    {
      title: 'amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'currency',
      dataIndex: 'currency',
      key: 'currency',
    }
    
  ];

  const { t } = useTranslation();


  const [employee, setEmployee] = useState({});
  const [employeeComponent, setEmployeeComponent] = useState([]);

  const onClose = () => {
    setVisibleDrawer(false);
  };

  const getEmployee = async () => {
    const result = await axios(constants.API_PREFIX + `/api/Employee/getEmployee/${drawerId}`);
    console.log("result employee", result.data);
    setEmployeeComponent(result.data.employeeComponents);
    setEmployee(result.data)
  }


  useEffect(() => {
    if (drawerId) {
      getEmployee();
    }
    // console.log("drawerId", drawerId)
  }, [drawerId]);



  return (
    <div>

      <Drawer width={640} placement="right" onClose={onClose} visible={visibleDrawer}>


        <p className="site-description-item-profile-p" style={{ marginBottom: 24 }}>
          {t(`userProfile`)}
        </p>
        <p className="site-description-item-profile-p">{t(`personal`)}</p>
        <Row>
          <Col span={12}>
            <DescriptionItem title={t(`fullName`)} content={`${employee.firstName} ${employee.lastName}`} />
          </Col>
          <Col span={12}>
            <DescriptionItem title={t(`email`)} content={employee.email} />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title={t(`mersonalNumber`)} content={employee.personalNumber} />
          </Col>
          <Col span={12}>
            <DescriptionItem title={t(`mobilePhone`)} content={employee.mobilePhone} />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title={t(`schemeTypeName`)} content={employee.schemeTypeName} />
          </Col>
          <Col span={12}>
            <DescriptionItem title={t(`position`)} content={employee.position} />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title={t(`bankAccountNumber`)} content={employee.bankAccountNumber} />
          </Col>
          <Col span={12}>
            <DescriptionItem title={t(`departmentName`)} content={employee.departmentName} />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title={t(`graceAmount`)} content={employee.graceAmount} />
          </Col>
          <Col span={12}>
            <DescriptionItem title="ResId" content={employee.resId} />
          </Col>
        </Row>

        <Divider />


        <p className="site-description-item-profile-p">Components</p>
        

        <Table columns={columns} dataSource={employeeComponent} />


        <Divider />



        <p className="site-description-item-profile-p">{t(`links`)}</p>
        <Row>
          <Col span={24}>
            <DescriptionItem
              title={t(`edit`)}
              content={
                // <a href={`Employee/Edit/${employee.id}`}>
                //   Employee/Edit
                // </a>
                <Link to={`Employee/Edit/${employee.id}`}>Payroll/Employee/Edit/{employee.id}</Link>
              }
            />
          </Col>
        </Row>




      </Drawer>


    </div>
  );
}

export default MyDrawer;
