import React, { useState } from 'react';
import { Space, Tooltip, Table, Button, Popconfirm, message } from 'antd';
import { useHistory } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axios from "axios";
import constants from '../../constant'
import { HOME_PAGE } from '../../constant';
import { useTranslation } from "react-i18next";

function EmployeeTable({ loading,employeeArray, fetchData, showDelete }) {

  const { t } = useTranslation();


    const columns = [
        {
            title: t(`actions`),
            dataIndex: 'actions',
            render: (text, record) =>
                <div>
                    <Space>
                        {showDelete ?
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
                            : ''
                        }

                        <Tooltip placement="bottom" title="რედაქტირება">
                            <Button onClick={() => clickEdit(record)} type="primary" icon={<EditOutlined />} />
                        </Tooltip>
                    </Space>


                </div>
        },
        {
            title: 'ResId',
            dataIndex: 'resId',
        },
        {
            title: t(`placeholderFirstName`),
            dataIndex: 'firstName',
            render: (a,item) => {return <>{item.firstName} {item.lastName}</> }
        },
        {
            title: t(`bankAccountNumber`),
            dataIndex: 'bankAccountNumber',
        },
        {
            title: t(`position`),
            dataIndex: 'position',
        },
        {
            title: t(`departmentName`),
            dataIndex: 'departmentName',
        },
        {
            title: t(`graceAmount`),
            dataIndex: 'graceAmount',
        },
        {
            title: t(`schemeTypeId`),
            dataIndex: 'schemeTypeId',
        },
    ];
    // const [dataSaveArray, setDataSaveArray] = useState([]);
    const [isEdiT, setIsEdiT] = useState(false);

    let history = useHistory();


    //   const fetchData = async () => {
    //     // setTableLoading(true);
    //     const result = await axios(constants.API_PREFIX + "/api/Employee");
    //     console.log("result1", result);
    //     setDataSaveArray(result.data)
    //     // setTableLoading(false);
    //   }

    //   useEffect(() => {
    //     fetchData();
    //   }, []);


    const confirm = async (record) => {
        console.log("record", record)
        const result = await axios.delete(constants.API_PREFIX + "/api/Employee", { data: record });
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
        // setIsEdiT(true);
        console.log("clickEdit222", record, record.resId)


        history.push(`${HOME_PAGE}/Employee/Edit/${record.id}`, record);
        // setIsModalVisible(true);
    }



    return (
        <div>
            <Table
                loading={loading}
                columns={columns}
                dataSource={employeeArray}

            />
        </div>
    );
}

export default EmployeeTable;
