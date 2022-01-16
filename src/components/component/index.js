import React, { useState, useEffect } from 'react';
import moment from 'moment';

import 'antd/dist/antd.css';
import { Table, Divider, Select, Modal, Button, message, Form, Input, Space, Popconfirm, Tooltip, DatePicker, Tag } from 'antd';
import { PlusCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axios from "axios";
import constants from '../../constant'
import { useTranslation } from "react-i18next";
import './index.css'
const { Option } = Select;


function Component() {

    const { t } = useTranslation();


    const columns = [
        // {
        //   title: 'id',
        //   dataIndex: 'id',
        // },
        {
            title: t(`actions`),
            dataIndex: 'actions',
            render: (text, record) =>
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
            title: t(`placeholderFirstName`),
            dataIndex: 'name',
            render: text => <a>{text}</a>,
        },
        {
            title: t(`coefficient`),
            dataIndex: 'coefficientName',
        },
        {
            title: t(`creditAcount`),
            dataIndex: 'creditAccountName',
        },
        {
            title: t(`debitAcount`),
            dataIndex: 'debitAccountName',
        },
        {
            title: t(`start`),
            dataIndex: 'startDate',
            render: (startDate, row) => (<span>
                {row.status.fieldNames && row.status.fieldNames.includes('StartDate') ?
                    <Tag color={'volcano'} >
                        {moment(startDate).format('YYYY-MM-DD')}
                    </Tag>
                    :
                     moment(startDate).format('YYYY-MM-DD') 
                }

            </span>),
        },
        {
            title: t(`finish`),
            dataIndex: 'endDate',
            render: (endDate, row) => (<span>
               {row.status.fieldNames && row.status.fieldNames.includes('EndDate') ?
                    <Tag color={'volcano'} >
                        {moment(endDate).format('YYYY-MM-DD')}
                    </Tag>
                    :
                     moment(endDate).format('YYYY-MM-DD') 
                }
            </span>),
        },
        {
            title: t(`dateOfCreation`),
            dataIndex: 'dateCreated',
            render: text => <p>{moment(text).format('YYYY-MM-DD')}</p>,
        },
    ];

    const [dataSaveArray, setDataSaveArray] = useState([]);
    const [component, setComponent] = useState({
        name: "",
        coefficientId: null,
        creditAccountId: null,
        debitAccountId: null,
        startDate: null,
        endDate: null,

    });
    const [tableLoading, setTableLoading] = useState(false);
    const [isEdiT, setIsEdiT] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [accountsReportChartType, setAccountsReportChartType] = useState([]);

    const [accountsReportCharts, setAccountsReportCharts] = useState([]);
    const [coefficients, setCoefficients] = useState([]);

    const fetchData = async () => {
        setTableLoading(true);
        const result = await axios(constants.API_PREFIX + "/api/Component");
        console.log("result", result.data);

        setDataSaveArray(result.data)
        setTableLoading(false);
    }



    const fetchAaccountsReportCharts = async () => {
        // setTableLoading(true);
        const result = await axios(constants.API_PREFIX + "/api/AccountsReportChart");
        setAccountsReportCharts(result.data)
        // setTableLoading(false);
    }


    const fetchCoefficients = async () => {
        // setTableLoading(true);
        const result = await axios(constants.API_PREFIX + "/api/Coefficient");

        console.log('result Coifficient---', result.data)
        setCoefficients(result.data)
        // setTableLoading(false);
    }



    useEffect(() => {
        fetchData();
        fetchAaccountsReportCharts();
        fetchCoefficients();
    }, []);



    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        setIsModalVisible(false);
        setIsEdiT(false);
        console.log("component", component)
        if (!isEdiT) {
            const result = await axios.post(constants.API_PREFIX + "/api/Component", component);
            console.log("resultPost", result)
            if (result.data.isSuccess) {
                fetchData();
                message.success(result.data.message);
            }
            else {
                message.error(result.data.message);
            }
        }
        else {
            const result1 = await axios.put(constants.API_PREFIX + "/api/Component", component);
            console.log("result1", result1)
            if (result1.data.isSuccess) {
                fetchData();
                message.success(result1.data.message);
            }
            else {
                message.error(result1.data.message);
            }
        }

        setComponent({
            name: "",
            coefficientId: null,
            creditAccountId: null,
            debitAccountId: null,
            startDate: null,
            endDate: null,
        })
    };

    const handleCancel = () => {
        setIsEdiT(false);
        setIsModalVisible(false);
        setComponent({
            name: "",
            coefficientId: null,
            creditAccountId: null,
            debitAccountId: null,
            startDate: null,
            endDate: null,
        })
    };

    const handleChange = (e) => {
        // console.log('handleChange', e.target);
        setComponent({ ...component, [e.target.name]: e.target.value })
    }

    const confirm = async (record) => {
        console.log("record", record)
        const result = await axios.delete(constants.API_PREFIX + "/api/Component", { data: record });
        console.log('result', result)
        if (result.data.isSuccess) {
            message.success(result.data.message);
            fetchData();
        }
        else {
            message.error(result.data.message);
        }
    }

    const clickEdit = (record) => {
        setIsEdiT(true);
        console.log("clickEdit", record)
        setComponent(record);
        setIsModalVisible(true);
    }

    const handleChangeSelect = (value, name) => {

        setComponent({ ...component, [name]: value });
        console.log('handleChangeSelect', value)

    }

    function onChange(date, dateString) {
        console.log(date, dateString);
    }


    return (
        <div>
            <Button type="primary" onClick={showModal} icon={<PlusCircleOutlined />}>
                {t(`add`)}
            </Button>
            <Modal
                loading={buttonLoading}
                okText={!isEdiT ? "დამატება" : "შენახვა"}
                cancelText={t(`cancelText`)}
                title={t(`component`)}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            // width={1000}
            >
                <Form>
                    <Form.Item>
                        <Space style={{ marginRight: "40px" }}>

                            <Form.Item
                                label={t(`placeholderFirstName`)}
                                rules={[{ required: true }]}
                                style={{ display: 'inline-block', width: 'calc(100% + 8px)' }}
                            >
                                <Input value={component.name} type="text" name="name" onChange={e => handleChange(e)} placeholder={t(`placeholderFirstName`)} />
                            </Form.Item>
                        </Space>


                        <Form.Item
                            label={t(`coefficient`)}
                            style={{
                                display: 'inline-block',
                                width: 'calc(50% - 8px)',
                                margin: '-20 8px',
                            }}
                        >
                            <Select
                                defaultValue="აირჩიეთ"
                                style={{ width: 120 }}
                                onChange={(value) => handleChangeSelect(value, 'coefficientId')}
                                value={component.coefficientId}
                                style={{
                                    display: 'inline-block',
                                    width: 'calc(100% - 8px)',
                                    margin: '-20 8px',
                                }}
                            >
                                {
                                    coefficients.map((i) =>
                                        <Option value={i.id}>{i.name}</Option>)
                                }


                            </Select>
                        </Form.Item>


                        <Form.Item
                            label={t(`creditAcount`)}
                            style={{
                                display: 'inline-block',
                                width: 'calc(50% - 8px)',
                                margin: '-20 8px',
                            }}
                        >
                            <Select
                                defaultValue="აირჩიეთ"
                                style={{ width: 120 }}
                                onChange={(value) => handleChangeSelect(value, 'creditAccountId')}
                                value={component.creditAccountId}
                                style={{
                                    display: 'inline-block',
                                    width: 'calc(100% - 8px)',
                                    margin: '-20 8px',
                                }}
                            >
                                {
                                    accountsReportCharts.map((i) =>
                                        <Option value={i.id}>{i.code}</Option>)
                                }


                            </Select>
                        </Form.Item>
                        <Form.Item
                            label={t(`debitAcount`)}
                            style={{
                                display: 'inline-block',
                                width: 'calc(50% - 8px)',
                                margin: '-20 8px',
                            }}
                        >
                            <Select
                                defaultValue="აირჩიეთ"
                                style={{ width: 120 }}
                                onChange={(value) => handleChangeSelect(value, 'debitAccountId')}
                                value={component.debitAccountId}
                                style={{
                                    display: 'inline-block',
                                    width: 'calc(100% - 8px)',
                                    margin: '-20 8px',
                                }}
                            >
                                {
                                    accountsReportCharts.map((i) =>
                                        <Option value={i.id}>{i.code}</Option>)
                                }


                            </Select>
                        </Form.Item>



                        <Form.Item
                            label={t(`start`)}
                            style={{
                                display: 'inline-block',
                                width: 'calc(50% - 8px)',
                                margin: '-20 8px',
                            }}
                        >
                            <Space>
                                <Space direction="vertical">
                                    <DatePicker
                                        value={component?.startDate ? moment.utc(component?.startDate, 'YYYY/MM/DD') : null}
                                        onChange={(value) => handleChangeSelect(value, 'startDate')} />
                                </Space>
                            </Space>

                        </Form.Item>

                        <Form.Item
                            label={t(`finish`)}
                            style={{
                                display: 'inline-block',
                                width: 'calc(50% - 8px)',
                                margin: '-20 8px',
                            }}
                        >
                            <Space>
                                <Space direction="vertical">
                                    <DatePicker
                                        value={component?.endDate ? moment.utc(component?.endDate, 'YYYY/MM/DD') : null}
                                        onChange={(value) => handleChangeSelect(value, 'endDate')} />
                                </Space>
                            </Space>

                        </Form.Item>



                    </Form.Item>
                </Form>
            </Modal>

            <Divider />

            <Table
                loading={tableLoading}
                columns={columns}
                dataSource={dataSaveArray}
            />
        </div>
    );
}

export default Component;
