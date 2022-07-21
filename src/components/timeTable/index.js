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
import './index.css'
const { Option } = Select;

const getDays = (year, month) => {
  return new Date(year, month, 0).getDate();
};

function TimeTable() {
  const { user } = useContext(UserContext);

  const [month, setMonth] = useState([{
    name: 'Jan',
    index: 1,
    days: getDays(2022, 1)
  }, {
    name: 'Feb',
    index: 2,
    days: getDays(2022, 2)
  }, {
    name: 'Marth',
    index: 3,
    days: getDays(2022, 3)
  }, {
    name: 'Apr',
    index: 4,
    days: getDays(2022, 4)
  }])
  const { t } = useTranslation();


  useEffect(() => {


  }, []);

  const tbody = (numrows) => {
    console.log('number', numrows)
    let arr = []
    for (let i = 1; i <= numrows; i++) {
      arr.push(i)
    }
    console.log('arr', arr)
    arr.map(r => <td>{r}</td>)
  }

  const numbers = [1, 2, 3, 4, 5];
  const listItems = numbers.map((number) =>
    <li>{number}</li>
  );
  return (
    <div>
      <h2>HTML Table</h2>

      {month.map(r =>  <tr>
        <ul>{listItems}</ul>

          </tr>
        )}
      

      <table>
        <tr>
          <th>Month</th>
        </tr>
        {month.map(r =>  <tr>
            <td>{r.name}</td>
            {tbody(r.days)}


          </tr>
        )}

      </table>
    </div>
  );
}

export default TimeTable;
