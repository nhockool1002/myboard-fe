import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Tooltip, Button, Modal, Input, Select, DatePicker } from 'antd';
import { PAYMENT_REMINDER } from 'helpers/url';
import { getUser, getToken } from "utils/common";
import { ShowSweetAlert } from "utils/common";
import Loader from "react-loader-spinner";
import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, CloseOutlined, PrinterOutlined, SubnodeOutlined } from '@ant-design/icons';
import axios from "axios";
import moment, { utc } from "moment";

const PaymentReminder = () => {
    const [loading, setIsLoading] = useState(false)
    const [alert, setAlert] = useState(null)
    const [currentUser, setCurrentUser] = useState({})
    const [data, setData] = useState([])
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showBillModal, setShowBillModal] = useState(false)

    const [paymentName, setPaymentName] = useState('')
    const [paymentPrice, setPaymentPrice] = useState('')
    const [paymentContent, setPaymentContent] = useState('')
    const [paymentDate, setPaymentDate] = useState('')
    const [paymentStatus, setPaymentStatus] = useState(0)

    const [currentPayment, setCurrentPayment] = useState({})

    const { TextArea } = Input
    const { Option } = Select

    const dateFormat = 'DD-MM-YYYY'
    const columns = [
        {
            title: 'Payment Name',
            dataIndex: 'payment_name',
        },
        {
            title: 'Payment Price',
            dataIndex: 'payment_price',
            render: (text) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text)
        },
        {
            title: 'Payment Content',
            dataIndex: 'payment_content',
        },
        {
            title: 'Duedate',
            dataIndex: 'payment_due_date',
            render: (text) => moment(text).format("DD-MM-YYYY")
        },
        {
            title: 'Status',
            dataIndex: 'payment_status',
            render: (text) => text == false ?
                <CloseCircleOutlined style={{ fontSize: '22px', color: '#d40404' }} /> :
                <CheckCircleOutlined style={{ fontSize: '22px', color: '#009c27' }} />
        },
        {
            title: 'Options',
            dataIndex: 'id',
            render: (item) => <div>
                <Tooltip placement="top" title="Sửa">
                    <EditOutlined onClick={() => showEditModalPrompt(item)} className={'buttonPayment'} />
                </Tooltip>
                <Tooltip placement="top" title="Xoá">
                    <CloseOutlined onClick={() => window.confirm("Xác nhận xoá Payemnt Reminder ?") == true ? removePayment(item) : ''} className={'buttonPaymentRemove'} />
                </Tooltip>
                <Tooltip placement="top" title="Tạo mã">
                    <PrinterOutlined onClick={() => showEditModalPrompt(item, 2)} className={'buttonPaymentPrint'} />
                </Tooltip>
            </div>
        },
    ];

    useEffect(() => {
        setIsLoading(true);
        const user = getUser();
        if (user !== null) {
            setCurrentUser(user);
            axios
                .get(PAYMENT_REMINDER.REST, {
                    headers: { Authorization: "Token " + getToken() },
                })
                .then((res) => {
                    setData(res.data.data)
                    setIsLoading(false);
                })
                .catch((error) => {
                    setIsLoading(false);
                    setAlert(
                        <ShowSweetAlert
                            type="danger"
                            title="Error"
                            message={error.response}
                            onClick={handleClickAlert}
                        >
                        </ShowSweetAlert>
                    );
                });
        }
    }, []);

    const handleClickAlert = () => {
        setAlert(null);
        setIsLoading(false);
    };

    const handleOk = () => {
        setIsLoading(true);
        if (currentUser) {
            axios
                .post(PAYMENT_REMINDER.REST, 
                {
                    payment_name: paymentName,
                    payment_content: paymentContent,
                    payment_due_date: paymentDate,
                    payment_price: paymentPrice,
                    payment_status: paymentStatus
                },
                {
                    headers: { Authorization: "Token " + getToken() },
                })
                .then((res) => {
                    var newData = data
                    newData.push(res.data.data)
                    setData([...newData])
                    setShowAddModal(false)
                    setIsLoading(false);
                    setAlert(
                        <ShowSweetAlert
                            type="success"
                            title="Success"
                            message={res.data.message}
                            onClick={handleClickAlert}
                        >
                        </ShowSweetAlert>
                    );
                })
                .catch((error) => {
                    setIsLoading(false);
                    setAlert(
                        <ShowSweetAlert
                            type="danger"
                            title="Error"
                            message={error.response.data.message}
                            onClick={handleClickAlert}
                        >
                        </ShowSweetAlert>
                    );
                });
        }
    }

    const showModal = () => {
        setShowAddModal(true)
    }

    const showEditModalPrompt = (item, type = 1) => {
        setIsLoading(true)
        if (currentUser) {
            axios
            .get(PAYMENT_REMINDER.REST + `?payment_reminder_id=${item}`, {
                headers: { Authorization: "Token " + getToken() },
            })
            .then((res) => {
                var data = res.data.data[0]
                setCurrentPayment(data)
                setIsLoading(false)
                setPaymentName(data.payment_name)
                setPaymentPrice(data.payment_price)
                setPaymentContent(data.payment_content)
                setPaymentDate(data.payment_due_date)
                setPaymentStatus(data.payment_status)
                if (type == 1) {
                    setShowEditModal(true)
                } else {
                    setShowBillModal(true)
                }
                
            })
            .catch((error) => {
                setIsLoading(false);
                setAlert(
                    <ShowSweetAlert
                        type="danger"
                        title="Error"
                        message={error.response}
                        onClick={handleClickAlert}
                    >
                    </ShowSweetAlert>
                );
            });
        }
    }

    const handleCancel = () => {
        resetData()
        setShowAddModal(false)
    }

    const handleChangePaymentName = (e) => {
        setPaymentName(e.target.value)
    }

    const handleChangePaymentPrice  = (e) => {
        setPaymentPrice(e.target.value)
    }

    const handleChangePaymentContent = (e) => {
        setPaymentContent(e.target.value)
    }

    const handleChangePaymentDate = (e) => {
        setPaymentDate(e)
    }

    const handleChangePaymentStatus = (e) => {
        setPaymentStatus(e)
    }

    const handleOkEditModal = (e) => {
        setIsLoading(true);
        if (currentUser) {
            axios
                .patch(PAYMENT_REMINDER.REST + `${currentPayment.id}`, 
                {
                    payment_name: paymentName,
                    payment_content: paymentContent,
                    payment_due_date: paymentDate,
                    payment_price: paymentPrice,
                    payment_status: paymentStatus
                },
                {
                    headers: { Authorization: "Token " + getToken() },
                })
                .then((res) => {
                    var newData = res.data.data
                    var listData = data;
                    var indexItem = listData.findIndex((item) => {
                        return item.id == newData.id;
                    })
                    listData[indexItem] = newData
                    setData([...listData])
                    setShowEditModal(false)
                    setIsLoading(false)
                    resetData()
                    setAlert(
                        <ShowSweetAlert
                            type="success"
                            title="Success"
                            message={res.data.status}
                            onClick={handleClickAlert}
                        >
                        </ShowSweetAlert>
                    );
                })
                .catch((error) => {
                    setIsLoading(false);
                    setAlert(
                        <ShowSweetAlert
                            type="danger"
                            title="Error"
                            message={error.response.data.message}
                            onClick={handleClickAlert}
                        >
                        </ShowSweetAlert>
                    );
                });
        }
    }

    const handleCancelEditModal = () => {
        resetData()
        setShowEditModal(false)
    }

    const resetData = () => {
        setPaymentName('')
        setPaymentPrice('')
        setPaymentContent('')
        setPaymentDate('')
        setPaymentStatus(0)
        setCurrentPayment({})
    }

    const handleCloseBill = () => {
        setShowBillModal(false)
        resetData()
    }

    const removePayment = (id) => {
        setIsLoading(true);
        if (currentUser) {
            axios
                .delete(PAYMENT_REMINDER.REST + `${id}`, {
                    headers: { Authorization: "Token " + getToken() },
                })
                .then((res) => {
                    var listData = data;
                    var indexItem = listData.findIndex((item) => {
                        return item.id == id;
                    })
                    listData.splice(indexItem, 1)
                    setData([...listData])
                    setIsLoading(false)
                })
                .catch((error) => {
                    setIsLoading(false)
                    setAlert(
                        <ShowSweetAlert
                            type="danger"
                            title="Error"
                            message={error.response}
                            onClick={handleClickAlert}
                        >
                        </ShowSweetAlert>
                    );
                });
        }
    }

    return (
        <div>
            {alert}
            {loading && (
                <div className="loaderWrapper">
                <Loader
                    visible={loading}
                    type="Puff"
                    color="#00BFFF"
                    height={100}
                    width="100%"
                />
                </div>
            )}
            <Tooltip placement="top" title="Thêm mới">
                <SubnodeOutlined className={'buttonPaymentAdd'} onClick={showModal} />
            </Tooltip>
            <Table columns={columns} dataSource={[...data]} />
            {/* Modal Add Payment Reminder */}
            <Modal
                title="Add Payment Reminder"
                visible={showAddModal}
                onOk={handleOk}
                onCancel={handleCancel}
                maskClosable={false}
                destroyOnClose
            >
                <Input placeholder="Payment Name" allowClear onChange={handleChangePaymentName} />
                <br /><br />
                <Input placeholder="Payment Price" type={"number"} onChange={handleChangePaymentPrice} />
                <br /><br />
                <TextArea placeholder="Payment Content" rows={4} allowClear onChange={handleChangePaymentContent} />
                <br /><br />
                <DatePicker placeholder="Payment Due Date" style={{ width: '100%' }} onChange={handleChangePaymentDate} format={dateFormat} />
                <br /><br />
                <Select defaultValue="0" style={{ width: '100%' }} onChange={handleChangePaymentStatus}>
                    <Option value="0">UNPAID</Option>
                    <Option value="1">PAID</Option>
                </Select>
            </Modal>
            {/* Modal Edit Payment Reminder */}
            <Modal
                title="Edit Payment Reminder"
                visible={showEditModal}
                onOk={handleOkEditModal}
                onCancel={handleCancelEditModal}
                maskClosable={false}
                destroyOnClose
            >
                <Input 
                    placeholder="Payment Name"
                    allowClear
                    onChange={handleChangePaymentName}
                    defaultValue={currentPayment.payment_name} 
                />
                <br /><br />
                <Input 
                    placeholder="Payment Price"
                    type={"number"}
                    onChange={handleChangePaymentPrice} 
                    defaultValue={currentPayment.payment_price ? currentPayment.payment_price : ''}
                />
                <br /><br />
                <TextArea 
                    placeholder="Payment Content"
                    rows={4} 
                    allowClear 
                    onChange={handleChangePaymentContent} 
                    defaultValue={currentPayment.payment_content ? currentPayment.payment_content : ''}
                />
                <br /><br />
                <DatePicker 
                    placeholder="Payment Due Date"
                    style={{ width: '100%' }}
                    onChange={handleChangePaymentDate} 
                    format={dateFormat} 
                    defaultValue={moment(currentPayment.payment_due_date ? currentPayment.payment_due_date : '', 'YYYY-MM-DD')}
                />
                <br /><br />
                <Select 
                    defaultValue={currentPayment.payment_status == true && currentPayment.payment_status == true  ? "1" : "0"} 
                    style={{ width: '100%' }} 
                    onChange={handleChangePaymentStatus}
                >
                    <Option value="0">UNPAID</Option>
                    <Option value="1">PAID</Option>
                </Select>
            </Modal>
            {/* Show Bill Payment Reminder */}
            <Modal
                title="Show Content Payment Reminder"
                visible={showBillModal}
                onOk={handleCloseBill}
                onCancel={handleCloseBill}
                maskClosable={false}
                destroyOnClose
            >
                <b>{currentPayment.payment_name}</b><br />
                ------------------<br />
                Ngày hết hạn : {moment(currentPayment.payment_due_date, dateFormat).format(dateFormat)}<br />
                {currentPayment.payment_content}<br />
                ------------------<br />
                Số tiền : {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentPayment.payment_price)}<br />
                VAT (10%) : {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentPayment.payment_price * (10/100))}<br />
                ------------------<br />
                <span style={{ fontWeight: "bold", color: "#F00"}}>Tổng cộng : </span>  <b>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseInt(currentPayment.payment_price) + (parseInt(currentPayment.payment_price) * (10/100)))}</b>
            </Modal>
        </div>
    );
};

export default PaymentReminder;