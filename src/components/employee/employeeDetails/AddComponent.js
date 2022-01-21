import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Row, Col, Select, Button, Modal, Table, DatePicker, Checkbox, Tag, Space, Popconfirm, Tooltip } from 'antd';
import { PlusCircleOutlined, DeleteOutlined, EditOutlined, CheckOutlined, CloseCircleOutlined } from '@ant-design/icons';
import axios from "axios";
import moment from 'moment';
import constants from '../../../constant'
import {
    useParams
} from "react-router-dom";
import './index.css'
import { v4 as uuidv4 } from 'uuid';
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

const { Option } = Select;



function AddComponent({ employee, setEmployee }) {

  const { t } = useTranslation();


    const columns = [
        {
            title: t(`actions`),
            dataIndex: 'actions',
            render: (text, record, index) =>
                <div>
                    <Space>
                        <Popconfirm
                            title="Are you sure to delete this task?"
                            onConfirm={() => confirm(record)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Tooltip placement="bottom" title="წაშლა">
                                <Button type="primary" icon={<DeleteOutlined />} />
                            </Tooltip>

                        </Popconfirm>
                        <Tooltip placement="bottom" title="რედაქტირება">
                            <Button onClick={() => clickEdit(record)} type="primary" icon={<EditOutlined />} />
                        </Tooltip>
                    </Space>
                </div>
        },

        {
            title: t(`status`),
            dataIndex: 'status',
            render: (status, row) => (<span>
                <Tag color={row.status.value == 1 ? 'green' : 'volcano'} >
                    {row.status.value == 1 ? t(`active`) : t(`passive`)}
                </Tag>
            </span>),
        },

        {
            title: t(`projectCode`),
            dataIndex: 'projectCode',
            render: (item, row) => <p>{getProjectCode(row)}</p>,
        },
        {
            title: t(`component`),
            dataIndex: 'component',
            render: (item, row) => <p>{getComponent(row)}</p>,
        },
        {
            title: 'costCenter',
            dataIndex: 'costCenter',
            render: (item, row) => <p>{getCostCenter(row)}</p>,
        },
        {
            title: t(`payment`),
            dataIndex: 'payment',
            render: (item, row) => <p>{getPayment(row)}</p>,
        },
        
        {
            title: t(`scheme`),
            dataIndex: 'scheme',
            render: (item, row) => <p>{getScheme(row)}</p>,
        },
        {
            title: t(`amount`),
            dataIndex: 'amount',
        },
        {
            title: t(`currency`),
            dataIndex: 'currency',
        },
        {
            title: t(`multiplePayment`),
            dataIndex: 'paidMultiple',
            render: (item, row) => <p>{item ? <CheckOutlined /> : '   '}</p>,
        },
        {
            title: t(`paymentByCash`),
            dataIndex: 'paidByCash',
            render: (item, row) => <p>{item ? <CheckOutlined /> : '   '}</p>,
        },
        {
            title: t(`start`),
            dataIndex: 'startDate',
            render: (startDate, row) => (<p style={{width: 100}}>
                {row.status.fieldNames && row.status.fieldNames.includes('StartDate') ?
                    <Tag color={'volcano'} >
                        {moment(startDate).format('YYYY-MM-DD')}
                    </Tag>
                    :
                     moment(startDate).format('YYYY-MM-DD') 
                }

            </p>),
        },
        {
            title: t(`finish`),
            dataIndex: 'endDate',
            render: (endDate, row) => (<p style={{width: 100}}>
                {row.status.fieldNames && row.status.fieldNames.includes('EndDate') ?
                     <Tag color={'volcano'} >
                         {moment(endDate).format('YYYY-MM-DD')}
                     </Tag>
                     :
                      moment(endDate).format('YYYY-MM-DD') 
                 }
             </p>),
        },
    ];



    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEdiTEmpComponent, setIsEdiTEmpComponent] = useState(false);
    const [projects, setProjects] = useState([]);
    const [schemes, setSchemes] = useState([]);
    const [paymentDaysTypes, setPaymentDaysTypes] = useState([]);
    const [costCenters, setCostCenters] = useState([]);
    const [components, setComponents] = useState([]);

    const [employeeComponent, setEmployeeComponent] = useState({
        componentName: "",
        projectCode: "",
        costCenterCode: "",
        // days: "",
        startDate: null,
        endDate: null,
        scheme: "",
        // amount: null,
        currency: "",
        paidByCash: false,
        // cashAmount: null,
        paidMultiple: false
    });


    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        console.log("shemodis")
        setIsEdiTEmpComponent(false);
        setIsModalVisible(false);

        if (!isEdiTEmpComponent) {
            console.log("!isEdiTEmpComponent")
            employeeComponent.id = uuidv4();
            setEmployee({
                ...employee,
                employeeComponents: [...employee.employeeComponents, { ...employeeComponent }]
            })
        }
        else {
            console.log("isEdiTEmpComponent")
            const newList = [...employee.employeeComponents];
            let objIndex = employee.employeeComponents.findIndex((obj => obj.id == employeeComponent.id));

            newList[objIndex] = employeeComponent;

            setEmployee({
                ...employee,
                employeeComponents: newList
            })
        }
        setEmployeeComponent({
            ...employeeComponent, projectId: "აირჩიეთ",
            componentId: "აირჩიეთ",
            costCenterId: "აირჩიეთ",
            schemeTypeId: "აირჩიეთ",
            paymentDaysTypeId: "აირჩიეთ",
            amount: "",
            currency: "",
            paidMultiple: false
        })

    };

    const handleChangeEmployeeComponent = (e) => {
        console.log(e.target.name, e.target.value);
        setEmployeeComponent({
            ...employeeComponent,
            [e.target.name]: (e.target.name != "amount") ? e.target.value
                : (isNaN(e.target.value) ? e.target.value : parseFloat(e.target.value))
        })

    }

    const handleChangeEmployeeComponentSelect = (value, name) => {
        setEmployeeComponent({ ...employeeComponent, [name]: value });
        console.log('handleChangeEmployeeComponents', value)
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    function onChangeBoolean(e, name) {
        console.log(`checked = ${e.target.checked} `, name);
        setEmployeeComponent({ ...employeeComponent, [name]: e.target.checked })
        console.log("employeeComponent", employeeComponent)
    }

    const getProjectCode = (row) => {
        const res = projects.filter(item => item.id == row.projectId)[0];
        return res?.code
    }

    const getComponent = (row) => {
        const res = components.filter(item => item.id == row.componentId)[0];
        return res?.name
    }

    const getCostCenter = (row) => {
        const res = costCenters.filter(item => item.id == row.costCenterId)[0];
        return res?.code
    }

    const getPayment = (row) => {
        const res = paymentDaysTypes.filter(item => item.id == row.paymentDaysTypeId)[0];
        return res?.name
    }

    const getScheme = (row) => {
        const res = schemes.filter(item => item.id == row.schemeTypeId)[0];
        return res?.name
    }

    const fetchProjects = async () => {
        // setTableLoading(true);
        const result = await axios(constants.API_PREFIX + "/api/project");

        setProjects(result.data)
        // setTableLoading(false);
    }

    const fetchSchemes = async () => {
        // setTableLoading(true);
        const result = await axios(constants.API_PREFIX + "/api/Common/schemeTypes");

        setSchemes(result.data)
        // setTableLoading(false);
    }

    const fetchPaymentDaysTypes = async () => {
        // setTableLoading(true);
        const result = await axios(constants.API_PREFIX + "/api/Common/PaymentDaysTypes");

        setPaymentDaysTypes(result.data)
        // setTableLoading(false);
    }

    const fetchCostCenters = async () => {
        // setTableLoading(true);
        const result = await axios(constants.API_PREFIX + "/api/CostCenter");

        setCostCenters(result.data)
        // setTableLoading(false);
    }
    const fetchComponents = async () => {
        // setTableLoading(true);
        const result = await axios(constants.API_PREFIX + "/api/Component/getAllActive");

        console.log('fetchComponents',result)
        setComponents(result.data)
        // setTableLoading(false);
    }

    useEffect(() => {
        fetchProjects();
        fetchCostCenters();
        fetchComponents();
        fetchSchemes();
        fetchPaymentDaysTypes();
    }, []);

    const clickEdit = (record) => {
        setIsEdiTEmpComponent(true);
        console.log("clickEdit111", record, employee.employeeComponents)
        const res = employee.employeeComponents.filter(item => item.id == record.id)[0];
        // console.log('res', res)
        setEmployeeComponent({ ...res });
        setIsModalVisible(true);
    }

    const confirm = async (record) => {
        console.log("record", record, employee.employeeComponents)
        const res = employee.employeeComponents.filter(item => item.id != record.id);
        setEmployee({
            ...employee,
            employeeComponents: res
        })
        console.log("res", res)
    }


    return (
        <div>
            <Row justify="center">

                <Modal
                    title={t(`addcomponents`)}
                    visible={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    width={700}
                >
                    <Row gutter={[16, 30]} >
                        <Col className="gutter-row" span={8}>
                            <span > {t(`project`)}: </span>
                            <Select
                                defaultValue="აირჩიეთ"
                                style={{ width: 200, marginTop: 5 }}
                                onChange={(value) => handleChangeEmployeeComponentSelect(value, 'projectId')}
                                value={employeeComponent.projectId}

                            >
                                {
                                    projects.map((i) =>
                                        <Option value={i.id}>{i.code}</Option>)
                                }


                            </Select>
                        </Col>
                        <Col className="gutter-row" span={8}>
                            <span > {t(`component`)}: </span>
                            <Select
                                defaultValue="აირჩიეთ"
                                style={{ width: 200, marginTop: 5 }}
                                onChange={(value) => handleChangeEmployeeComponentSelect(value, 'componentId')}
                                value={employeeComponent.componentId}
                            >
                                {
                                    components.map((i) =>
                                        <Option value={i.id}>{i.name}</Option>)
                                }


                            </Select>
                        </Col>
                        <Col className="gutter-row" span={8}>
                            <span > Cost Center: </span>
                            <Select
                                defaultValue="აირჩიეთ"
                                style={{ width: 200, marginTop: 5 }}
                                onChange={(value) => handleChangeEmployeeComponentSelect(value, 'costCenterId')}
                                value={employeeComponent.costCenterId}
                            >
                                {
                                    costCenters.map((i) =>
                                        <Option value={i.id}>{i.code}</Option>)
                                }


                            </Select>
                        </Col>
                        <Col className="gutter-row" span={8}>
                            <span > {t(`scheme`)}: </span>
                            <Select
                                defaultValue="აირჩიეთ"
                                style={{ width: 200, marginTop: 5 }}
                                onChange={(value) => handleChangeEmployeeComponentSelect(value, 'schemeTypeId')}
                                value={employeeComponent.schemeTypeId}
                            >
                                {
                                    schemes.map((i) =>
                                        <Option value={i.id}>{i.name}</Option>)
                                }


                            </Select>
                            <span > {t(`currency`)}: </span>
                            <Select
                                defaultValue="აირჩიეთ"
                                value={employeeComponent.currency}
                                style={{ width: 200, marginTop: 5 }}
                                onChange={(value) => handleChangeEmployeeComponentSelect(value, 'currency')}
                            >
                                <Option value="GEL">GEL</Option>
                                <Option value="USD">USD</Option>
                                <Option value="EUR">EUR</Option>
                            </Select>
                        </Col>

                        <Col className="gutter-row" span={8}>
                            <span > {t(`paymentDays`)}: </span>
                            <Select
                                defaultValue="აირჩიეთ"
                                style={{ width: 200, marginTop: 5 }}
                                onChange={(value) => handleChangeEmployeeComponentSelect(value, 'paymentDaysTypeId')}
                                value={employeeComponent.paymentDaysTypeId}
                            >
                                {
                                    paymentDaysTypes.map((i) =>
                                        <Option value={i.id}>{i.name}</Option>)
                                }


                            </Select>
                        </Col>
                        <Col className="gutter-row" span={8}>
                            <span > {t(`amount`)}: </span>
                            <Input type="number" style={{ marginTop: 5 }} value={employeeComponent.amount} name="amount" onChange={e => handleChangeEmployeeComponent(e)} placeholder="თანხა" />
                        </Col>
                        <Col className="gutter-row" span={8}>
                            {/* <span > {t(`currency`)}: </span>
                            <Select
                                defaultValue="აირჩიეთ"
                                value={employeeComponent.currency}
                                style={{ width: 200, marginTop: 5 }}
                                onChange={(value) => handleChangeEmployeeComponentSelect(value, 'currency')}
                            >
                                <Option value="GEL">GEL</Option>
                                <Option value="USD">USD</Option>
                                <Option value="EUR">EUR</Option>
                            </Select> */}
                             <span >{t(`paymentByCash`)}: </span> <br />
                            <Checkbox value={employeeComponent.paidByCash} onChange={(e) => onChangeBoolean(e, 'paidByCash')}>Checkbox</Checkbox>
                        </Col>
                        <Col className="gutter-row" span={8}>
                            <span > {t(`multiplePayment`)}: </span>
                            <Checkbox style={{ marginTop: 5 }} value={employeeComponent.paidMultiple} onChange={(e) => onChangeBoolean(e, 'paidMultiple')}>Checkbox</Checkbox>
                        </Col>
                        <Col className="gutter-row" span={8}>
                            {/* <span >{t(`paymentByCash`)}: </span> <br />
                            <Checkbox value={employeeComponent.paidByCash} onChange={(e) => onChangeBoolean(e, 'paidByCash')}>Checkbox</Checkbox> */}
                        </Col>
                        <Col className="gutter-row" span={8}>
                            <span >{t(`start`)}: </span> <br />
                            <DatePicker value={employeeComponent.startDate? moment.utc(employeeComponent.startDate, 'YYYY/MM/DD'): null} style={{ marginTop: 5 }} 
                            onChange={(value) => handleChangeEmployeeComponentSelect(value, 'startDate')} />
                        </Col>
                        <Col className="gutter-row" span={8}>
                            <span >{t(`finish`)}: </span> <br />
                            <DatePicker value={employeeComponent.endDate? moment.utc(employeeComponent.endDate, 'YYYY/MM/DD'): null} style={{ marginTop: 5 }} 
                             onChange={(value) => handleChangeEmployeeComponentSelect(value, 'endDate')} />
                        </Col>

                    </Row>


                </Modal>
            </Row>
            <br/>
            <Button type="primary" onClick={showModal} icon={<PlusCircleOutlined />}>
            {t(`addcomponents`)}
            </Button>
            <br/>
            <br/>
            <Table
                columns={columns}
                dataSource={employee.employeeComponents}
                scroll={{ x: 200 }}
            />
        </div>
    );
}

export default AddComponent;
