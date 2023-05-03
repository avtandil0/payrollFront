import React, { useState, useEffect, useContext } from "react";
import {
  Form,
  Space,
  Table,
  Tag,
  Input,
  Button,
  message,
  Select,
  DatePicker,
} from "antd";
import { SearchOutlined, TableOutlined } from "@ant-design/icons";
import axios from "axios";
import constants from "../../constant";
import moment from "moment";
import { sumBy } from "lodash";

const yearsOptions = [];
for (let i = 2020; i < new Date().getFullYear(); i++) {
  yearsOptions.push({
    value: i,
    label: i,
  });
}

const monthOptions = [];
for (let i = 0; i < 12; i++) {
  monthOptions.push({
    value: i,
    label: i,
  });
}

const data = [];
const Report = () => {

const [columns, setColumns] = useState([
  {
    title: "Res_id",
    dataIndex: "resId",
    key: "res_id",
  },
  {
    title: "პირადი ნომერი",
    dataIndex: "personalNumber",
    key: "personalNumber",
    render: (text) => <>{text}</>,
  },
  {
    title: "სახელი",
    dataIndex: "firstName",
    key: "firstName",
  },
  {
    title: "გვარი",
    dataIndex: "lastName",
    key: "lastName",
  },

]);
  const [form] = Form.useForm();

  const [declarationData, setDeclarationData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  const fetchData = async (year, month) => {
    setTableLoading(true);
    const result = await axios(
      constants.API_PREFIX + "/api/Report/GetReport",
      {
        params: {
          year: year,
          month: month ? month + 1 : null,
        },
      }
    );
    console.log("result", result.data);

    setDeclarationData(result.data);
    setTableLoading(false);
  };

  const onFinish = (values) => {
    console.log("Success:", values);
    let year = values.monthYear.year();
    let month = values.monthYear.month();
    fetchData(year, month);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const renderCompValue = (id,record) => {
    console.log('texttext',id, record)
    let target = record.employeeComponents.find(r => r.componentId == id)
    console.log('amount', target)
    return target?.amount
  }


  const getActiveComp = (data) => {
    let currentDate = new Date();
    let activeComp = data.filter(r => new Date(r.startDate) < currentDate && new Date(r.endDate) > currentDate)
    console.log('activeComp',data,activeComp)
    return activeComp
  }
  const fetchComponents =async () =>{
    const result = await axios(
      constants.API_PREFIX + "/api/Component",

    );
    console.log("fetchComponentsfetchComponents", result.data);

    let comps =  result.data.map(r => {
      return {
        title: r.name,
        dataIndex: r.id,
        key: r.name,
        render: (text, record) => <>{renderCompValue(r.id,record)}</>,
      }
    })

    let sumAmount = 0;
    // result.data.forEach(r => {
    //   sumAmount += renderCompValue(r.id,r)
    // });



    let sum = {
      title: 'Sum',
      dataIndex: 'sum',
      key: 'sum',
      render: (text, record) => <>{sumBy(getActiveComp(record.employeeComponents), (r) => r.amount)?.toFixed(2)}</>,
    }

    console.log('compscomps',comps)
    setColumns([...columns,  ...comps,sum])
  }
  useEffect(() => {
    fetchComponents();
    fetchData(moment(new Date()).year(), moment(new Date()).month());
  }, []);
  const executeCalculation = async () => {
    //calculateForDeclaration
    const result = await axios.post(
      constants.API_PREFIX + "/api/Calculation/calculateForDeclaration"
    );
    console.log("result", result);
    if (result.data.isSuccess) {
      message.success(result.data.message);
      fetchData();
    } else {
      message.error(result.data.message);
    }
  };

  const onChange = () => {
    form.submit();
  };
  return (
    <>


      <br />
      {/* <Button onClick={executeCalculation} icon={<TableOutlined />}>
        Calculate
      </Button> */}
      <br />
      <br />

      <Table
        loading={tableLoading}
        columns={columns}
        dataSource={declarationData}
      />
    </>
  );
};
export default Report;
