import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Row,
  Col,
  Select,
  Button,
  message,
  Upload,
  Modal,
  Skeleton,
} from "antd";
import {
  PlusCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  PlusOutlined,
  PicLeftOutlined,
  FieldTimeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Tabs } from "antd";

import axios from "axios";
import moment from "moment";
import constants from "../../../constant";
import { useParams } from "react-router-dom";
import "./index.css";
import { v4 as uuidv4 } from "uuid";
import { useHistory } from "react-router-dom";
import AddComponent from "./AddComponent";
import { useTranslation } from "react-i18next";
import { HOME_PAGE } from "../../../constant";
import WorkingHours from "./WorkingHours";
import { groupBy } from "lodash";
import TimeTable from "../../timeTable";
import Personal from "./Personal";
import PersonTimeShift from "./PersonTimeShift";

const { TabPane } = Tabs;

const { Option } = Select;

function EmployeeDetails() {
  const { t } = useTranslation();

  const [form] = Form.useForm();
  let { id } = useParams();
  let history = useHistory();

  // const handleSave = (values) => {
  //     console.log("onFinish", values);
  //     // call save API
  // };

  const [isEdiT, setIsEdiT] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [employeeGraceTypes, setEmployeeGraceTypes] = useState([]);
  const [employeeGraceTypesAmount, setEmployeeGraceTypesAmount] = useState("");
  const [employeeTypes, setEmployeeTypes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [saveloading, setSaveloading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [sheets, setSheets] = useState([]);
  const [sheetData, setSheetData] = useState([]);

  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    mobilePhone: "",
    email: "",
    personalNumber: "",
    address: "",
    bankAccountNumber: "",
    scheme: "",
    employeeTypes: "",
    departmentName: "",
    employeeComponents: [],
  });

  const fetchSchemes = async () => {
    // setTableLoading(true);
    const result = await axios(
      constants.API_PREFIX + "/api/Common/schemeTypes"
    );

    console.log("result setSchemes---", result.data);
    setSchemes(result.data);
    // setTableLoading(false);
  };

  const onChange = (key) => {
    console.log(key);
  };

  const fetchEmployeeGraceTypes = async () => {
    // setTableLoading(true);
    const result = await axios(
      constants.API_PREFIX + "/api/Common/EmployeeGraceTypes"
    );

    console.log("result fetchEmployeeGraceTypes---", result.data);
    setEmployeeGraceTypes(result.data);
    // setTableLoading(false);
  };

  const fetchEmployeeTypes = async () => {
    // setTableLoading(true);
    const result = await axios(
      constants.API_PREFIX + "/api/Common/EmployeeTypes"
    );

    console.log("result setSchemes---", result.data);
    setEmployeeTypes(result.data);
    // setTableLoading(false);
  };

  const fetchDepartments = async () => {
    // setTableLoading(true);
    const result = await axios(constants.API_PREFIX + "/api/department");

    console.log("result EmployeeTypes---", result.data);
    setDepartments(result.data);
    // setTableLoading(false);
  };

  const fetchEmployeeById = async (id) => {
    // setTableLoading(true);
    const result = await axios(
      constants.API_PREFIX + `/api/Employee/getEmployee/${id}`
    );

    console.log("result fetchEmployeeById11111", result.data);

    setEmployee(result.data);
    var blob = new Blob([result.data.avatar], {
      type: "application/octet-stream",
    });
    var srcBase64 = "data:image/jpeg;base64," + btoa(atob(result.data.avatar));

    if (!result.data.avatar) {
      console.log("No Avatar");
      setSelectedFileList([]);
      return;
    }
    console.log("Has Avatar ");
    setSelectedFile({
      uid: "-1",
      name: `${result.data.firstName} ${result.data.lastName}`,
      status: "done",
      thumbUrl: srcBase64,
    });
    setSelectedFileList([
      {
        uid: "-1",
        name: `${result.data.firstName} ${result.data.lastName}`,
        status: "done",
        thumbUrl: srcBase64,
      },
    ]);

    // setTableLoading(false);
  };

  const getSheets = async () => {
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
    setSheets(target);
  };
  useEffect(() => {
    console.log("----------------------------------985");
    getSheets();
    if (id) {
      setIsEdiT(true);
      setCurrentId(id);
      //   fetchEmployeeById(id);
    }
    //     fetchProjects();
    // //     fetchCostCenters();
    // fetchDepartments();
    // //     fetchComponents();
    // fetchSchemes();
    // //     fetchPaymentDaysTypes();
    // fetchEmployeeTypes();
    // fetchEmployeeGraceTypes();
  }, []);

  useEffect(() => {
    console.log("------------", currentId);
    if (currentId) {
      setIsEdiT(true);
      fetchEmployeeById(currentId);
    }

    fetchDepartments();
    fetchSchemes();
    fetchEmployeeTypes();
    fetchEmployeeGraceTypes();
  }, [currentId]);

  const handleChange = (e) => {
    // console.log(e.target.name, e.target.value);
    // setEmployee({ ...employee, [e.target.name]: e.target.value })
    setEmployee({
      ...employee,
      [e.target.name]:
        e.target.name != "graceAmount"
          ? e.target.value
          : isNaN(e.target.value)
          ? e.target.value
          : parseFloat(e.target.value),
    });
  };

  const requiredFieldRule = [{ required: true, message: "Required Field" }];

  const handleChangeSelect = (value, name) => {
    const result = employeeGraceTypes.filter(
      (employeeGraceTypes) => employeeGraceTypes.id == value
    );

    let newObj = { ...employee, [name]: value };

    if (name == "employeeGraceTypeId") {
      newObj.graceAmount = result[0]?.amount;
    }

    setEmployee(newObj);
  };

  const [selectedFile, setSelectedFile] = useState();
  const [selectedFileList, setSelectedFileList] = useState();

  const handleChangeAvatar = (info) => {
    const nextState = {};
    switch (info.file.status) {
      case "uploading":
        nextState.selectedFileList = [info.file];
        break;
      case "done":
        nextState.selectedFile = info.file;
        nextState.selectedFileList = [info.file];
        break;

      default:
        // error or removed
        nextState.selectedFile = null;
        nextState.selectedFileList = [];
    }
    // this.setState(() => nextState);
    setSelectedFile(nextState.selectedFile);
    setSelectedFileList(nextState.selectedFileList);
  };

  const base64ToFile = async (base64) => {
    console.log("base64base64base64", base64);
    const res = await fetch(base64);
    const blob = await res.blob();
    let avatar = new File([blob], "fileName", { type: "image/png" });
    return avatar;
  };

  const handleSaveEmployee = async () => {
    console.log("avto", selectedFile, selectedFileList);

    var bodyFormData = new FormData();

    let result;
    setSaveloading(true);
    if (!isEdiT) {
      result = await axios.post(
        constants.API_PREFIX + "/api/Employee",
        employee
      );
    } else {
      result = await axios.put(
        constants.API_PREFIX + "/api/Employee",
        employee
      );
    }

    if (result.data.id || result.data.isSuccess) {
      // if(selectedFile?.originFileObj){
      console.log("selectedFile.originFileObj", currentId, selectedFile);

      let avatarFile = null;

      if (selectedFile?.thumbUrl) {
        console.log("selectedFile?.thumbUrl", selectedFile?.thumbUrl);
        avatarFile = await base64ToFile(selectedFile?.thumbUrl);
      }

      console.log("avatarFileavatarFile", avatarFile);
      bodyFormData.append("file", avatarFile);
      //   bodyFormData.append("file", selectedFile?.originFileObj);
      bodyFormData.append("userId", currentId ? currentId : result.data.id);

      console.log("bodyFormData", bodyFormData);

      let avatarResult = await axios({
        method: "post",
        url: constants.API_PREFIX + "/api/Employee/uploadAvatar",
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("avatarResult", avatarResult);
      // }
    }

    setSaveloading(false);
    console.log("result7788 ", result);

    if (result.data.id) {
      console.log("4444444444");
      // fetchData();
      message.success("წარმატებით დასრულდა");
      setIsEdiT(true);
      setCurrentId(result.data.id);
      history.push(`${HOME_PAGE}/Employee/Edit/${result.data.id}`);
    } else {
      console.log("55555555555");
      if (result.data.isSuccess) {
        message.success("წარმატებით დასრულდა");
      } else {
        message.success(result.data.message);
      }
    }
  };

  const goBack = () => {
    history.push(`${HOME_PAGE}/Employee/`);
  };

  const { loading, setLoading } = useState("");
  const { imageUrl, setImageUrl } = useState(null);

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <span style={{ marginLeft: 15 }}>Upload</span>
    </div>
  );

  const [fileList, setFileList] = useState([]);

  const handleChangeFileList = async (info) => {
    console.log("info", info);
    let image = await getBase64(info.file.originFileObj);
    setPreviewImage(image);
    let fileList = [...info.fileList];

    // 1. Limit the number of uploaded files
    // Only to show the last recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-1);
    setFileList(fileList);
  };

  async function getBase64(file) {
    let f = await base64ToFile(file);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file);
    }

    setPreviewVisible(true);
    setPreviewImage(file.thumbUrl || file.preview);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChangeSheet = (value) => {
    console.log("handleChangeSheet", value);
    let d = sheets.find((r) => r.sheetId == value);
    console.log(d);
    setSheetData(d.child);
  };
  return (
    <div>
      {/* <Skeleton.Image  active={true}/>
            <Skeleton.Avatar active={true} size={150} shape={'square'} /> */}

      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: `Personal`,
            key: "1",
            children: <Personal />,
          },
          {
            label: `Time shift`,
            key: "2",
            children: <PersonTimeShift />,
          }
        ]}
      />


    </div>
  );
}

export default EmployeeDetails;
