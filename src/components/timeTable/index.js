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
  Menu,
  Tag,
  Tabs,
  DatePicker,
} from "antd";
import {
  PlusCircleOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import constants from "../../constant";
import { useTranslation } from "react-i18next";
import { UserContext } from "../../appContext";
import "./index.css";
import { MONTHS, WEEKDAYS } from "../../constant";
import Meta from "antd/lib/card/Meta";
import TextArea from "antd/lib/input/TextArea";
import { TreeSelect } from "antd";

import { groupBy } from "lodash";
import WorkingHours from "../employee/employeeDetails/WorkingHours";
const { RangePicker } = DatePicker;
const { SHOW_PARENT } = TreeSelect;

const { Option } = Select;

const getDays = (year, month) => {
  return new Date(year, month, 0).getDate();
};

const format = "HH:mm";
const dateFormat = "YYYY/MM/DD";

function TimeTable({ employeeId }) {
  const { user } = useContext(UserContext);

  const [year, setYear] = useState(2022);
  const [copedData, setCopedData] = useState([]);
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
    let weekDayText = WEEKDAYS.find((r, i) => r.value === weekDay).text;
    return `${selectedDate.day}-${selectedDate.month + 1}-${
      selectedDate.year
    } -- ${weekDayText}`;
  };
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sheets, setSheets] = useState([]);
  const [sheets1, setSheets1] = useState([]);

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

  const getSheets = async () => {
    let res = await axios.get(
      constants.API_PREFIX + "/api/TimeTable/GetAllTimePeriods",
      {
        params: {
          employeeId: employeeId,
        },
      }
    );
    const grouped = groupBy(res.data, (d) => {
      return [moment(d.date).format("l")];
    });
    console.log("resresres", grouped);
    setSheets(grouped);
  };

  const getSheets1 = async () => {
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
    setSheets1(target);
  };

  const getDepData = async () => {
    let result = await axios(
      constants.API_PREFIX + "/api/Department/GetAllDepartmentAndEmployees"
    );
    console.log("resullltt", result);
    result = result.data.map((r) => {
      return {
        id: r.depId,
        title: r.depName,
        value: r.depId,
        key: r.depId,
        children: r.children.map((e) => {
          return {
            id: e.id,
            title: e.fullName,
            value: e.id,
            key: e.id,
          };
        }),
      };
    });
    console.log("resullltt", result);
    setTreeData(result);
  };
  useEffect(() => {
    getSheets1();
    getSheets();
    getDepData();
  }, []);

  const [form] = Form.useForm();

  const selectDay = (d, m) => {
    setSelectedDate({
      name: d,
      day: d,
      month: m,
      year: year,
    });
    console.log("34343434", sheets[`${m + 1}/${d}/${year}`], form);
    // setSheets()
    console.log("{{{{{{{", form.getFieldsValue("sheets1"));
    if (sheets[`${m + 1}/${d}/${year}`]) {
      let editableSheets = sheets[`${m + 1}/${d}/${year}`].map((r) => {
        return {
          id: r.id,
          key: r.id,
          startTime: moment(
            new Date().toLocaleDateString() + " " + r.startTime
          ),
          endTime: moment(new Date().toLocaleDateString() + " " + r.endTime),
        };
      });

      console.log("editableSheetseditableSheets", editableSheets);
      form.setFieldsValue({ sheets: editableSheets });
    }

    showModal();
  };

  const getDayColor = (data, r) => {
    let day = new Date(year, data.index, r);
    if (day.getDay() == 0 || day.getDay() == 6) {
      return "#ccc";
    }
    return "";
  };

  const copyDayData = (e, r, monthIndex) => {
    console.log("copyD", sheets[`${monthIndex + 1}/${r}/${year}`]);
    setCopedData(sheets[`${monthIndex + 1}/${r}/${year}`]);
  };

  const pasteDayData = async (e, d, m) => {
    console.log(d, m + 1, year);
    console.log("coped data", copedData);

    let postData = copedData?.map((r) => {
      return {
        date: `${year}-${m + 1}-${d}`,
        startTime: r.startTime,
        endTime: r.endTime,
      };
    });

    console.log("postDatapostData,postData", postData);

    const result = await axios.post(constants.API_PREFIX + "/api/TimeTable", {
      timePeriods: postData,
      range: [],
      employeeId: employeeId,
    });

    getSheets();
  };

  const tbody = (data) => {
    console.log("datadata", data);
    let arr = [];
    for (let i = 1; i <= data.days; i++) {
      arr.push(i);
    }
    return arr.map((r) => (
      <td style={{ border: "1px solid #dddddd", padding: 6 }}>
        {" "}
        <Dropdown
          overlay={
            <Menu
              items={[
                {
                  label: "copy",
                  key: "1",
                  onClick: (e) => copyDayData(e, r, data.index),
                },
                {
                  label: "paste",
                  key: "2",
                  onClick: (e) => pasteDayData(e, r, data.index),
                },
              ]}
            />
          }
          trigger={["contextMenu"]}
        >
          <div
            style={{ cursor: "pointer", backgroundColor: getDayColor(data, r) }}
            onClick={() => selectDay(r, data.index)}
          >
            <span style={{ fontSize: 8 }}>{r}</span>
            {sheets[`${data.index + 1}/${r}/${year}`] ? (
              <>
                <div style={{ width: 25 }}>
                  {sheets[`${data.index + 1}/${r}/${year}`].map((item) => {
                    return (
                      <Tag>
                       {item.workingEndTime}
                      </Tag>
                    );
                  })}
                </div>
              </>
            ) : null}
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

  const onFinish = async ({ sheets }) => {
    console.log(
      "Received values of form:",
      sheets,
      selectedDate,
      "----",
      new Date(selectedDate.year, selectedDate.month, selectedDate.day)
    );
    // setSheets(values.sheets);

    let postData = sheets?.map((r) => {
      return {
        id: r.id,
        date: `${selectedDate.year}-${selectedDate.month + 1}-${
          selectedDate.day
        }`,
        startTime: r.startTime.format(format),
        endTime: r.endTime.format(format),
      };
    });

    console.log("postDatapostData,postData", postData);

    const result = await axios.post(constants.API_PREFIX + "/api/TimeTable", {
      timePeriods: postData,
      range: [],
      employeeId: employeeId,
    });

    getSheets();
    console.log(result);
    setIsModalVisible(false);
  };

  const removePeriod = (remove, name, id) => {
    console.log("remove", remove, name, id);
  };

  const [sheetData, setSheetData] = useState([]);

  const handleChangeSheet = (value) => {
    console.log("handleChangeSheet", value);
    let d = sheets1.find((r) => r.sheetId == value);
    console.log(d);
    setSheetData(d.child);
  };

  const handleSubmitRange = async () => {
    console.log(" employeeIdemployeeId", employeeId);

    console.log("handleSubmitRangehandleSubmitRange", sheetData);

    // let postData = sheetData?.map((r) => {
    //   return {
    //     id: r.id,
    //     date: `${selectedDate.year}-${selectedDate.month + 1}-${
    //       selectedDate.day
    //     }`,
    //     startTime: r.workingStartTime
    //       ? r.workingStartTime
    //       : r.breakingStartTime,
    //     endTime: r.workingEndTime ? r.workingEndTime : r.breakingEndTime,
    //     isBreakTime: r.breakingStartTime ? true : false,
    //   };
    // });

    let postData = [];
    sheetData.forEach((r) => {
      postData.push({
        id: r.id,
        date: `${selectedDate.year}-${selectedDate.month + 1}-${
          selectedDate.day
        }`,
        startTime: r.workingStartTime,
        endTime: r.workingEndTime,
        isBreakTime: false,
      });

      postData.push({
        id: r.id,
        date: `${selectedDate.year}-${selectedDate.month + 1}-${
          selectedDate.day
        }`,
        startTime: r.breakingStartTime,
        endTime: r.breakingEndTime,
        isBreakTime: true,
      });
    });

    console.log("postDatapostData,postData1222", postData, rangePickerValue);

    const result = await axios.post(constants.API_PREFIX + "/api/TimeTable", {
      timePeriods: postData,
      range: rangePickerValue,
      employeeId: employeeId,
      treeValues: value,
    });

    getSheets();
    console.log(result);
    setIsModalVisible(false);
  };

  const [rangePickerValue, setRangePickerValue] = useState([]);

  const onChangeRangePicker = (date, dateString) => {
    console.log(date, dateString);
    setRangePickerValue(dateString);
  };

  const [value, setValue] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const onChange = (newValue) => {
    console.log("onChange ", value);
    setValue(newValue);
  };

  const tProps = {
    treeData,
    value,
    onChange,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: "Please select",
    style: {
      width: "290px",
    },
  };

  return (
    <div>
      <Modal
        title={selectedDateText()}
        visible={isModalVisible}
        // onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={1000}
      >
        {/* <Select
          defaultValue="type"
          style={{ width: 120, marginBottom: 18 }}
          onChange={handleChange}
        >
          <Option value="jack">working</Option>
          <Option value="lucy">holday</Option>

        </Select> */}
        <Tabs defaultActiveKey="1" centered>
          <Tabs.TabPane tab="Manually" key="1">
            <Form
              form={form}
              name="dynamic_form_nest_item"
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.List name="sheets">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space
                        key={key}
                        style={{ display: "flex", marginBottom: 8 }}
                        align="baseline"
                      >
                        <Form.Item
                          {...restField}
                          name={[name, "startTime"]}
                          rules={[
                            { required: true, message: "Missing start time" },
                          ]}
                        >
                          <TimePicker format={format} />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "endTime"]}
                          rules={[
                            { required: true, message: "Missing end time" },
                          ]}
                        >
                          <TimePicker format={format} />
                        </Form.Item>
                        <MinusCircleOutlined
                          onClick={(e) => removePeriod(remove, name, e)}
                        />
                      </Space>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add field
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  შენახვა
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Time Range" key="2">
            <RangePicker
              onChange={onChangeRangePicker}
              defaultValue={[
                moment(
                  `${selectedDate.year}-${selectedDate.month + 1}-${
                    selectedDate.day
                  }`,
                  dateFormat
                ),
              ]}
            />

            <span style={{ fontSize: 20, marginLeft: 15 }}>choose shift</span>
            <Select
              style={{ width: 220, marginLeft: 10 }}
              onChange={handleChangeSheet}
            >
              {sheets1.map((r) => {
                return <Option value={r.sheetId}>{r.name}</Option>;
              })}
            </Select>

            <TreeSelect {...tProps} />
            <br></br>
            <br></br>
            <WorkingHours data={sheetData} handleSubmit={handleSubmitRange} />
          </Tabs.TabPane>
        </Tabs>

        {/* {[1, 2, 3, 4, 5, 6, 7, 8].map((r) => {
          return (
            <div style={{ display: "flex", gap: 10, marginBottom: 5 }}>
              <span>{r}.</span>
              <TimePicker format={format} onChange={onChangeTime} />
              <TimePicker format={format} onChange={onChangeTime}/>
            </div>
          );
        })} */}
      </Modal>

      <h2>MRS</h2>

      <Select style={{ width: 120 }} onChange={handleChangeYear} value={year}>
        {years?.map((r) => (
          <Option value={r}>{r}</Option>
        ))}
      </Select>
      {/* <Select style={{ width: 120, marginLeft: 20 }} onChange={handleChange}>
        {MONTHS?.map((r) => (
          <Option value={r.value}>{r.text}</Option>
        ))}
      </Select> */}

      <Select
        defaultValue="type"
        style={{ width: 120, marginLeft: 18 }}
        onChange={handleChange}
      >
        <Option value="jack">dayly</Option>
        <Option value="lucy">hourly</Option>
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
