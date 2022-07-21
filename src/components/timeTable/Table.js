import React, { useState, useEffect, useContext } from "react";
import moment from "moment";

import "antd/dist/antd.css";
import {
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
import { MONTHS } from "../../constant";
const { Option } = Select;

const getDays = (year, month) => {
  return new Date(year, month, 0).getDate();
};

function Table({data}) {
  const { user } = useContext(UserContext);

  const [year, setYear] = useState(2020);
  const [months, setMonths] = useState([
    ...MONTHS.map((r) => {
      return { name: r.text, index: r.value, days: getDays(year, r.value) };
    }),
  ]);

  const renderTable = (y) => {
    let x = MONTHS.map((r) => {
      return { name: r.text, index: r.value, days: getDays(y, r.value) };
    });
    console.log("xxxxxxxxxxxx", x);
    return x;
  };

  const [years, setYears] = useState([2018, 2019, 2020, 2021, 2022]);

  const { t } = useTranslation();

  useEffect(() => {}, []);

  const tbody = (numrows) => {
    console.log("number", numrows);
    let arr = [];
    for (let i = 1; i <= numrows; i++) {
      arr.push(i);
    }
    console.log("arr", arr);
    return arr.map((r) => <td>{r}</td>);
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  const handleChangeYear = (value) => {
    console.log(`selected ${value}`);
    setYear(value);
  };

  return (
    <div>
      <h2>Time Table</h2>

      <br />
      <br />
      <table>
        <tr>
          <th>Month</th>
        </tr>
        {renderTable(year).map((r) => (
          <tr>
            <td>{r.name}</td>
            {tbody(r.days)}
          </tr>
        ))}
      </table>

      <br />
      <table>
        <tr>
          <th>Month</th>
        </tr>
        {months.map((r) => (
          <tr>
            <td>{r.name}</td>
            {tbody(r.days)}
          </tr>
        ))}
      </table>
    </div>
  );
}

export default Table;
