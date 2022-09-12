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
  TimePicker,
  Dropdown,
  Menu
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
import "./index.css";
import { MONTHS, WEEKDAYS } from "../../constant";
import Meta from "antd/lib/card/Meta";
import TextArea from "antd/lib/input/TextArea";
const { Option } = Select;

const getDays = (year, month) => {
  return new Date(year, month, 0).getDate();
};

const format = "HH:mm";

function TimeTable() {
  const { user } = useContext(UserContext);

  const [year, setYear] = useState(2022);
  const [months, setMonths] = useState([
    ...MONTHS.map((r, i) => {
      return { name: r.text, index: i, days: getDays(year, r.value) };
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
      // `${selectedDate.year}-${selectedDate.month}-${selectedDate.day}`
      selectedDate.year,
      selectedDate.month,
      selectedDate.day
    ).getDay();
    console.log("WEEKDAYSWEEKDAYS", selectedDate, weekDay, WEEKDAYS);
    let weekDayText = WEEKDAYS.find((r, i) => r.value === weekDay).text;
    return `${selectedDate.day}-${selectedDate.month + 1}-${
      selectedDate.year
    } -- ${weekDayText}`;
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

  const getDayColor = (data, r) => {
    let day = new Date(year, data.index, r);
    if (day.getDay() == 0 || day.getDay() == 6) {
      return "#ccc";
    }
    return "";
  };

  const menu = (
    <Menu
      items={[
        {
          label: "copy",
          key: "1",
        },
        {
          label: "paste",
          key: "2",
        },
      ]}
    />
  );

  const tbody = (data) => {
    let arr = [];
    for (let i = 1; i <= data.days; i++) {
      arr.push(i);
    }
    return arr.map((r) => (
      <td style={{ border: "1px solid #dddddd", padding: 6 }}>
        {" "}

        <Dropdown overlay={menu} trigger={["contextMenu"]}>
        <div
          style={{ cursor: "pointer", backgroundColor: getDayColor(data, r) }}
          onClick={() => selectDay(r, data.index)}
        >
          {r}
        </div>
        </Dropdown>

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
    return MONTHS.map((r, i) => {
      return { name: r.text, index: i, days: getDays(y, i) };
    });
  };

  const handleChangeYear = (value) => {
    console.log(`selected ${value}`);
    setYear(value);
    let data = renderTable(value);
    setMonths(data);
  };

  return (
    <div>

      <Modal
        title={selectedDateText()}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={400}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8].map((r) => {
          return (
            <div style={{ display: "flex", gap: 10, marginBottom: 5 }}>
              <span>{r}.</span>
              <TimePicker format={format} />
              <TimePicker format={format} />
            </div>
          );
        })}
      </Modal>

      <h2>Time Table</h2>

      <Select style={{ width: 120 }} onChange={handleChangeYear} value={year}>
        {years?.map((r) => (
          <Option value={r}>{r}</Option>
        ))}
      </Select>
      <Select style={{ width: 120, marginLeft: 20 }} onChange={handleChange}>
        {MONTHS?.map((r) => (
          <Option value={r.value}>{r.text}</Option>
        ))}
      </Select>
      <br />
      <br />

      <br />
      <table className="timeTable">
        <tr>
          <th>Month</th>
        </tr>
        {months.map((r) => (
          <tr>
            <td style={{ border: "1px solid #dddddd", padding: 8 }}>
              {r.name}
            </td>
            {tbody(r)}
          </tr>
        ))}
      </table>
    </div>
  );
}

export default TimeTable;
