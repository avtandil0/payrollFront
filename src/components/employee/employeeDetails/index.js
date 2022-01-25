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
    Skeleton
} from "antd";
import {
    PlusCircleOutlined,
    CloseCircleOutlined,
    LoadingOutlined,
    PlusOutlined
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import constants from "../../../constant";
import { useParams } from "react-router-dom";
import "./index.css";
import { v4 as uuidv4 } from "uuid";
import { useHistory } from "react-router-dom";
import AddComponent from "./AddComponent";
import { useTranslation } from "react-i18next";
import { HOME_PAGE } from '../../../constant';


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
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

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
        employeeComponents: []
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
        var blob = new Blob([result.data.avatar], {type: "application/octet-stream"});
        var srcBase64 = "data:image/jpeg;base64," + btoa(atob(result.data.avatar));

        if(!result.data.avatar){
            setSelectedFileList([])
            return;
        }
        setSelectedFileList([{
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: srcBase64,
          }])

        // setTableLoading(false);
    };

    useEffect(() => {
        console.log('----------------------------------')
        if (id) {
            setIsEdiT(true);
            setCurrentId(id)
            fetchEmployeeById(id);
        }
        //     fetchProjects();
        //     fetchCostCenters();
        fetchDepartments();
        //     fetchComponents();
        fetchSchemes();
        //     fetchPaymentDaysTypes();
        fetchEmployeeTypes();
        fetchEmployeeGraceTypes();
    }, []);

    useEffect(() => {
        console.log('------------',currentId)
        if (currentId) {
            setIsEdiT(true);
            fetchEmployeeById(currentId);
        }
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
                        : parseFloat(e.target.value)
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

    const handleChangeAvatar = info => {
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
        setSelectedFile(nextState.selectedFile)
        setSelectedFileList(nextState.selectedFileList)
      };

    const handleSaveEmployee = async () => {
        console.log("avto",selectedFile, selectedFileList);
        // setEmployee({...employee, avatar:selectedFile })

        // const headers = {
        //     'Content-Type': 'multipart/form-data',
        //   }

        //   let e = {
        //       name:'',
        //       file: selectedFile
        //   }

          var bodyFormData = new FormData();


        //   Object.keys(employee).forEach(key => bodyFormData.append(key, employee[key]));
        //   bodyFormData.append('avatar', selectedFile.originFileObj);


        // console.log('bodyFormData', bodyFormData)
        // let tt = await axios(
        //     {
        //         method: "post",
        //         url: constants.API_PREFIX + "/api/Employee",
        //         data: bodyFormData,
        //         headers: { "Content-Type": "multipart/form-data" },
        //       }

        // );

        // return;
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

       if(result.data.id || result.data.isSuccess){
        // if(selectedFile?.originFileObj){
            console.log('selectedFile.originFileObj',currentId,selectedFile?.originFileObj)
            bodyFormData.append('file', selectedFile?.originFileObj);
            bodyFormData.append('userId', currentId? currentId: result.data.id);

            console.log('bodyFormData', bodyFormData)

            let avatarResult = await axios(
                {
                    method: "post",
                    url: constants.API_PREFIX + "/api/Employee/uploadAvatar",
                    data: bodyFormData,
                    headers: { "Content-Type": "multipart/form-data" },
                }

            );

            console.log('avatarResult',avatarResult)
        // }
       }


        setSaveloading(false)
        console.log("result7788 ", result);

        if (result.data.id) {
            console.log('4444444444')
            // fetchData();
            message.success("წარმატებით დასრულდა");
            setIsEdiT(true);
            setCurrentId(result.data.id)
            history.push(`${HOME_PAGE}/Employee/Edit/${result.data.id}`);
        } else {
            console.log('55555555555')
            if(result.data.isSuccess){
                message.success("წარმატებით დასრულდა");
            }
            else{
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
            <span style={{marginLeft: 15}} >Upload</span>
        </div>
    );

    const [fileList, setFileList] = useState([]);

    const handleChangeFileList = async (info) => {
        console.log('info',info)
        let image = await getBase64(info.file.originFileObj);
        setPreviewImage(image);
        let fileList = [...info.fileList];

        // 1. Limit the number of uploaded files
        // Only to show the last recent uploaded files, and old ones will be replaced by the new
        fileList = fileList.slice(-1);
        setFileList(fileList);
    };

    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    const handlePreview = async (file) => {
        console.log("file", file);
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewVisible(true);
        setPreviewImage(file.url || file.preview);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf("/") + 1));

    };

    return (
        <div>

            {/* <Skeleton.Image  active={true}/>
            <Skeleton.Avatar active={true} size={150} shape={'square'} /> */}


            <Upload
                onPreview={handlePreview}
                listType="picture-card"
                fileList={selectedFileList}
                defaultFileList={[
                    {
                      uid: '1',
                      name: '123.png',
                      status: 'done',
                      response: 'Server Error 500', // custom error message to show
                      url: 'https://t3.ftcdn.net/jpg/02/09/37/00/360_F_209370065_JLXhrc5inEmGl52SyvSPeVB23hB6IjrR.jpg',
                    },
                  ]}
                customRequest={ ({ file, onSuccess }) => {
                    setTimeout(() => {
                      onSuccess("ok");
                    }, 0);
                  }}
                onChange={handleChangeAvatar}
            >
                {/* {imageUrl ? (
                    <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
                ) : (
                    uploadButton
                )} */}

                {uploadButton}
            </Upload>

            <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={() => setPreviewVisible(false)}
            >
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>

            {/* <Upload style={{width: "10px"}} listType="picture" fileList={fileList} onChange={handleChangeFileList}>
            <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload> */}

            <Card title="Add Employee" loading={false}>
                <Form
                    wrapperCol={{ span: 18 }}
                    form={form}
                    name="product-form"
                    // onFinish={handleSave}
                    layout={"vertical"}
                >
                    <Row>
                        <Col span={6}>
                            <Form.Item label={t(`placeholderFirstName`)} rules={requiredFieldRule}>
                                <Input
                                    disabled={employee.resId != null}
                                    value={employee.firstName}
                                    name="firstName"
                                    onChange={(e) => handleChange(e)}
                                />
                            </Form.Item>
                            <Form.Item label={t(`placeholderLastName`)}>
                                <Input
                                    disabled={employee.resId != null}
                                    value={employee.lastName}
                                    name="lastName"
                                    onChange={(e) => handleChange(e)}
                                />
                            </Form.Item>
                            <Form.Item label="ResId">
                                <Input
                                    disabled
                                    value={employee.resId}
                                    name="resId"
                                    onChange={(e) => handleChange(e)}
                                />
                            </Form.Item>
                            <Form.Item label="landIso">
                                <Input
                                    disabled={employee.resId != null}
                                    value={employee.landIso}
                                    name="landIso"
                                    onChange={(e) => handleChange(e)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={t(`mobilePhone`)}>
                                <Input
                                    disabled={employee.resId != null}
                                    value={employee.mobilePhone}
                                    name="mobilePhone"
                                    onChange={(e) => handleChange(e)}
                                />
                            </Form.Item>
                            <Form.Item label={t(`email`)}>
                                <Input
                                    disabled={employee.resId != null}
                                    value={employee.email}
                                    name="email"
                                    onChange={(e) => handleChange(e)}
                                />
                            </Form.Item>
                            <Form.Item label={t(`personalNumber`)}>
                                <Input
                                    disabled={employee.resId != null}
                                    value={employee.personalNumber}
                                    name="personalNumber"
                                    onChange={(e) => handleChange(e)}
                                />
                            </Form.Item>

                            <Form.Item label={t(`employeeGraceGroup`)}>
                                <Select
                                    disabled={employee.resId != null}
                                    defaultValue="აირჩიეთ"
                                    onChange={(value) =>
                                        handleChangeSelect(value, "employeeGraceTypeId")
                                    }
                                    value={employee.employeeGraceTypeId}
                                >
                                    {employeeGraceTypes.map((i) => (
                                        <Option value={i.id}>{i.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={t(`address`)}>
                                <Input
                                    disabled={employee.resId != null}
                                    value={employee.address}
                                    name="address"
                                    onChange={(e) => handleChange(e)}
                                />
                            </Form.Item>
                            <Form.Item label={t(`bankAccountNumber`)}>
                                <Input
                                    disabled={employee.resId != null}
                                    value={employee.bankAccountNumber}
                                    name="bankAccountNumber"
                                    onChange={(e) => handleChange(e)}
                                />
                            </Form.Item>
                            <Form.Item label={t(`scheme`)}>
                                <Select
                                    disabled={employee.resId != null}
                                    defaultValue="აირჩიეთ"
                                    onChange={(value) =>
                                        handleChangeSelect(value, "schemeTypeId")
                                    }
                                    value={employee.schemeTypeId}
                                >
                                    {schemes.map((i) => (
                                        <Option value={i.id}>{i.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item label={t(`graceAmount`)}>
                                <Input
                                    disabled={employee.resId != null}
                                    type="number"
                                    value={employee.graceAmount}
                                    name="graceAmount"
                                    onChange={(e) => handleChange(e)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={t(`departmentName`)}>
                                <Select
                                    disabled={employee.resId != null}
                                    defaultValue="აირჩიეთ"
                                    onChange={(value) =>
                                        handleChangeSelect(value, "departmentId")
                                    }
                                    value={employee.departmentId}
                                >
                                    {departments.map((i) => (
                                        <Option value={i.id}>{i.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label={t(`position`)}>
                                <Input
                                    disabled={employee.resId != null}
                                    value={employee.position}
                                    name="position"
                                    onChange={(e) => handleChange(e)}
                                />
                            </Form.Item>

                            <Form.Item label={t(`employeeTypes`)}>
                                <Select
                                    disabled={employee.resId != null}
                                    defaultValue="აირჩიეთ"
                                    onChange={(value) =>
                                        handleChangeSelect(value, "employeeTypeId")
                                    }
                                    value={employee.employeeTypeId}
                                >
                                    {employeeTypes.map((i) => (
                                        <Option value={i.id}>{i.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item label={t(`remainingGraceAmount`)}>
                                <Input
                                    disabled
                                    type="number"
                                    value={employee.remainingGraceAmount}
                                    name="remainingGraceAmount"
                                    onChange={(e) => handleChange(e)}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Card>

            <AddComponent employee={employee} setEmployee={setEmployee} />
            <br />
            <Button
                loading={saveloading}
                type="primary"
                onClick={handleSaveEmployee}
                icon={<PlusCircleOutlined />}
            >
                შენახვა
            </Button>
            <Button
                style={{ marginLeft: "10px" }}
                onClick={goBack}
                icon={<CloseCircleOutlined />}
            >
                დახურვა
            </Button>
        </div>
    );
}

export default EmployeeDetails;
