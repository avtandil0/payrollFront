import React, { useState, useEffect, useContext } from "react";
import moment from "moment";

import "antd/dist/antd.css";
import {
  Table,
  Divider,
  Select,
  Modal,
  Button,
  message,
  Form,
  Input,
  Space,
  Popconfirm,
  Tooltip,
  Card,
} from "antd";
import {
  PlusCircleOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "./index.css";
import { MONTHS, WEEKDAYS } from "../../../constant";
import Meta from "antd/lib/card/Meta";
import TextArea from "antd/lib/input/TextArea";
import { TimePicker } from "antd";

const { Option } = Select;

const getDays = (year, month) => {
  return new Date(year, month, 0).getDate();
};

function WorkingHours({handleSubmit}) {
  const [year, setYear] = useState(2022);
  const [months, setMonths] = useState([
    ...MONTHS.map((r) => {
      return { name: r.text, index: r.value, days: getDays(year, r.value) };
    }),
  ]);

  const [years, setYears] = useState([2018, 2019, 2020, 2021, 2022]);
  const [selectedDate, setSelectedDate] = useState({
    name: "788",
    day: 1,
    month: 1,
    year: 1990,
  });

  const selectedDateText = () => {
    let weekDay = new Date(
      `${selectedDate.year}-${selectedDate.month}-${selectedDate.day}`
    ).getDay();
    console.log("WEEKDAYSWEEKDAYS", weekDay, WEEKDAYS);
    let weekDayText = WEEKDAYS.find((r) => r.value + 1 === weekDay).text;
    return `${selectedDate.day}-${selectedDate.month}-${selectedDate.year} -- ${weekDayText}`;
  };
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const { t } = useTranslation();

  useEffect(() => {}, []);

  const selectDay = (d, m) => {
    setSelectedDate({
      name: d,
      day: d,
      month: m,
      year: year,
    });
    showModal();
  };

  const tbody = (data) => {
    console.log("dataaa", data);
    let arr = [];
    for (let i = 1; i <= data.days; i++) {
      arr.push(i);
    }
    return arr.map((r) => (
      <td>
        {" "}
        <div
          style={{ cursor: "pointer" }}
          onClick={() => selectDay(r, data.index)}
        >
          {r}
        </div>
        {/* <Card hoverable >
          <Meta title={r} description={r} />
          {r}
        </Card> */}
      </td>
    ));
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const renderTable = (y) => {
    return MONTHS.map((r) => {
      return { name: r.text, index: r.value, days: getDays(y, r.value) };
    });
  };

  const handleChangeYear = (value) => {
    console.log(`selected ${value}`);
    setYear(value);
    let data = renderTable(value);
    setMonths(data);
  };

  const onFinish = async (sheets) => {
    console.log("Received values of form:", sheets);
    handleSubmit(sheets)
    // setSheets(values.sheets);
  };
  const format = "HH:mm";

  const tailLayout = {
    wrapperCol: {
      offset: 2,
      span: 18,
    },
  };
  return (
    <div>
      {/* <h2>Working Hours</h2> */}
      <Form
        name="nest-messages"
        onFinish={onFinish}
        layout="inline"
      >
        {WEEKDAYS.map((r) => {
          return (
            <>
              <Form.Item  label={r.text} name={[r.text, "workingTime"]}>
                <TimePicker.RangePicker format={"HH:mm"} />
              </Form.Item>
              <Form.Item  name={[r.text, "breakingTime"]}>
                <TimePicker.RangePicker format={"HH:mm"} />
              </Form.Item>
            </>
          );
        })}

        <Form.Item wrapperCol={{ offset: 24, span: 8 }}>
          <Button type="primary" htmlType="submit">
            შენახვა
          </Button>
        </Form.Item>
      </Form>
      {/* <table className="timeTable">
        <tr>
          <th></th>
          <th>working time</th>
          <th>break time</th>
        </tr>
        <tr>
          <td width={150}>{WEEKDAYS[0].text}</td>
          <td width={300}>
            <TimePicker.RangePicker format={"HH:mm"} />
          </td>
          <td width={300}>
            <TimePicker.RangePicker format={"HH:mm"} />
          </td>
        </tr>


      </table> */}
      {/* <Form onFinish={onFinish} autoComplete="off" layout="inline">
        {WEEKDAYS.map((r) => (
          <>
            <Form.Item
              name={"startTime"}
              rules={[{ required: true, message: "Missing start time" }]}
            >
              <TimePicker format={format} />
            </Form.Item>
            <Form.Item
              name={"endTime"}
              rules={[{ required: true, message: "Missing end time" }]}
            >
              <TimePicker format={format} />
            </Form.Item>
          </>
        ))}

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Submit
          </Button>
        </Form.Item>
      </Form> */}
    </div>
  );
}

export default WorkingHours;
