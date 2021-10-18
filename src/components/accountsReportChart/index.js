import React, { useState, useEffect } from 'react';
import moment from 'moment';

import 'antd/dist/antd.css';
import { Table, Divider, Select, Modal, Button, message, Form, Input, Space, Popconfirm, Tooltip } from 'antd';
import { PlusCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axios from "axios";
import constants from '../../constant'

const { Option } = Select;


function AccountsReportChart() {
    const columns = [
        // {
        //   title: 'id',
        //   dataIndex: 'id',
        // },
        {
            title: 'Actions',
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
                            <Tooltip title="წაშლა">
                                <Button type="primary" icon={<DeleteOutlined />} />
                            </Tooltip>

                        </Popconfirm>
                        <Tooltip title="რედაქტირება">
                            <Button onClick={() => clickEdit(record)} type="primary" icon={<EditOutlined />} />
                        </Tooltip>
                    </Space>
                </div>
        },
        {
            title: 'კოდი',
            dataIndex: 'code',
            render: text => <a>{text}</a>,
        },
        {
            title: 'აღწერა',
            dataIndex: 'description',
        },
        {
            title: 'ტიპი',
            dataIndex: 'accountsReportChartTypeName',
        },
        {
            title: 'შექმნის თარიღი',
            dataIndex: 'dateCreated',
            render: text => <p>{moment(text).format('LLL')}</p>,
        },
    ];

    const [dataSaveArray, setDataSaveArray] = useState([]);
    const [accountsReportChart, setAccountsReportChart] = useState({
        code: "",
        description: "",
        accountsReportChartTypeId: null

    });
    const [tableLoading, setTableLoading] = useState(false);
    const [isEdiT, setIsEdiT] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [accountsReportChartType, setAccountsReportChartType] = useState([]);

    const { TextArea } = Input;

    const fetchData = async () => {
        setTableLoading(true);
        const result = await axios(constants.API_PREFIX+"/api/AccountsReportChart");
        console.log("result", result.data);

        setDataSaveArray(result.data)
        setTableLoading(false);
    }



    const fetchDatAaccountsReportChartType = async () => {
        // setTableLoading(true);
        const result = await axios(constants.API_PREFIX+"/api/Common/accountsReportChartTypes");

        console.log('result accountsReportChartTypes---',result)
        setAccountsReportChartType(result.data)
        // setTableLoading(false);
    }

    useEffect(() => {
        fetchData();
        fetchDatAaccountsReportChartType();
    }, []);



    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        setIsModalVisible(false);
        setIsEdiT(false);
        console.log("accountsReportChartPost", accountsReportChart)
        if (!isEdiT) {
            const result = await axios.post(constants.API_PREFIX+"/api/AccountsReportChart", accountsReportChart);
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
            const result1 = await axios.put(constants.API_PREFIX+"/api/AccountsReportChart", accountsReportChart);
            console.log("result1", result1)
            if (result1.data.isSuccess) {
                fetchData();
                message.success(result1.data.message);
            }
            else {
                message.error(result1.data.message);
            }
        }
        setAccountsReportChart({
            code: "",
            description: "",
            accountsReportChartTypeId: null
        })

    };

    const handleCancel = () => {
        setIsEdiT(false);
        setIsModalVisible(false);
        setAccountsReportChart({
            code: "",
            description: "",
            accountsReportChartTypeId: null
        })
    };

    const handleChange = (e) => {
        // console.log('handleChange', e.target);
        setAccountsReportChart({ ...accountsReportChart, [e.target.name]: e.target.value })
    }

    const confirm = async (record) => {
        console.log("record", record)
        const result = await axios.delete(constants.API_PREFIX+"/api/AccountsReportChart", { data: record });
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
        setAccountsReportChart(record);
        setIsModalVisible(true);
    }

    const handleChangeSelect = (value) => {

        setAccountsReportChart({ ...accountsReportChart, "accountsReportChartTypeId": value });
        console.log('handleChangeSelect', value)

    }


    return (
        <div>
            <Button type="primary" onClick={showModal} icon={<PlusCircleOutlined />}>
                დამატება
            </Button>
            <Modal
                loading={buttonLoading}
                okText={!isEdiT ? "დამატება" : "შენახვა"}
                cancelText="გაუქმება"
                title="ანგარიშთა გეგმის ანგარიში"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            // width={1000}
            >
                <Form>
                    <Form.Item>
                        <Space style={{ marginRight: "40px" }}>

                            <Form.Item
                                label="კოდი"
                                rules={[{ required: true }]}
                                style={{ display: 'inline-block', width: 'calc(100% + 8px)' }}
                            >
                                <Input value={accountsReportChart.code} type="text" name="code" onChange={e => handleChange(e)} placeholder="კოდი" />
                            </Form.Item>
                        </Space>


                        <Form.Item
                            label="ანგარიშთა გეგმა"
                            style={{
                                display: 'inline-block',
                                width: 'calc(50% - 8px)',
                                margin: '-20 8px',
                            }}
                        >
                            <Select
                                defaultValue="აირჩიეთ"
                                style={{ width: 120 }}
                                onChange={handleChangeSelect}
                                value={accountsReportChart.accountsReportChartTypeId} 
                                style={{
                                    display: 'inline-block',
                                    width: 'calc(100% - 8px)',
                                    margin: '-20 8px',
                                }}
                            >
                                {
                                    accountsReportChartType.map((i) =>
                                        <Option value={i.id}>{i.name}</Option>)
                                }


                            </Select>
                        </Form.Item>


                        <Form.Item
                            // label="აღწერა"
                            // rules={[{ required: true }]}
                            // style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginLeft: "10px" }}
                            style={{ marginBottom: 0 }}
                        >
                            <TextArea placeholder="აღწერა..." value={accountsReportChart.description} type="text" name="description" onChange={e => handleChange(e)} placeholder="აღწერა" />
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

export default AccountsReportChart;
