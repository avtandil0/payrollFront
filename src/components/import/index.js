import React, { useState, useEffect,useContext } from "react";

import "antd/dist/antd.css";
import {
  Select,

  Steps,
} from "antd";


import axios from "axios";
import constants from "../../constant";
import { useTranslation } from "react-i18next";
import UploadFileStep1 from './UploadFileStep1'
import ProcessingFileStep2 from './ProcessingFileStep2'
import FileImportResultStep3 from './FileImportResultStep3'
import { UserContext } from "../../appContext";

import "./index.css";

const { Option } = Select;
const { Step } = Steps;

function Import() {

  const { user } = useContext(UserContext);

  const { t } = useTranslation();


  const [component, setComponent] = useState({
    name: "",
    coefficientId: null,
    creditAccountId: null,
    debitAccountId: null,
    startDate: null,
    endDate: null,
  });

  const [file, setFile] = useState({
    cols: [
      { name: "A", key: 0 },
      { name: "B", key: 1 },
      { name: "C", key: 2 },
      { name: "D", key: 3 },
      { name: "E", key: 4 },
      { name: "F", key: 5 },
      { name: "G", key: 6 },
      { name: "H", key: 7 },
      { name: "I", key: 8 },
      { name: "J", key: 9 },
      { name: "K", key: 10 },
      { name: "L", key: 11 },
    ],
    rows: [
      [""],
      [""],
      [""],
      [""],
      [""],
      [""],
      [""],
      [""],
      [""],
      [""],
      [""],
      [""],
      [""],
      [""],
      [""],
      [""],
    ],
  });

  const [current, setCurrent] = React.useState(0);
  const [components, setComponents] = useState([]);

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    // setTableLoading(true);
    const result = await axios(
      constants.API_PREFIX + "/api/Component/getAllActive"
    );

    console.log("fetchComponents", result);
    setComponents(result.data);
    // setTableLoading(false);
  };

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = [
    {
      title: "Upload",
      content: <UploadFileStep1 next={next} file={file} setFile={setFile} />,
    },
    {
      title: "Process",
      content: <ProcessingFileStep2 next={next} file={file} setFile={setFile} />,
    },
    {
      title: "Result",
      content: <FileImportResultStep3 />,
    },
  ];

  return (
    <div>
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>

      <div className="steps-content">{steps[current].content}</div>

      <br />
    </div>
  );
}

export default Import;
