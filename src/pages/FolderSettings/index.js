import React, { useState, useEffect } from "react";
import { Card, Col, Row, Table, Button, Form, Input, Select } from "antd";
import { v4 as uuidv4 } from "uuid";
import { getUser, getToken } from "utils/common";
import { S3_API, SELF_URL } from "helpers/url";
import { useHistory } from "react-router-dom";
import Loader from "react-loader-spinner";
import axios from "axios";
import { ShowSweetAlert } from "utils/common";
import SweetAlert from "react-bootstrap-sweetalert";
import S3CreateBucket from "assets/images/world.png";

// table code start
const columns = [
  {
    title: "FOLDER NAME",
    dataIndex: "folder_name",
    key: "folder_name",
  },
  {
    title: "FOLDER KEY",
    dataIndex: "folder_key",
    key: "folder_key",
  },
  {
    title: "CREATED BY",
    dataIndex: "created_by",
    key: "created_by",
  },
  {
    title: "DELETE",
    dataIndex: "delete_folder",
    key: "delete_folder",
    width: "30px",
  },
];

const FolderSetting = (props) => {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [update, setUpdate] = useState(0);
  const [selectDefaultValue, setSelectDefaultValue] = useState("");
  const [dataSelect, setDataSelect] = useState([]);
  const [currentBucket, setCurrentBucket] = useState(0);
  const [currentBucketName, setCurrentBucketName] = useState("");
  const [listAllBucket, setListAllBucket] = useState([]);
  const { Option } = Select;

  useEffect(() => {
    const user = getUser();
    if (user !== null) {
      setCurrentUser(user);
      axios
        .get(S3_API.GET_ALL_S3_BUCKET, {
          headers: { Authorization: "Token " + getToken() },
        })
        .then((res) => {
          setListAllBucket(res.data.data);
          handleReceiveData(res.data.data);
        })
        .catch((error) =>
          setAlert(
            <ShowSweetAlert
              type="danger"
              title="Error"
              message={error.response}
              onClick={handleClickAlert}
            ></ShowSweetAlert>
          )
        );
    } else window.location.href = SELF_URL.LOGIN;
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const user = getUser();
    if (user !== null) {
      setCurrentUser(user);
      axios
        .get(S3_API.GET_FOLDER_BY_BUCKET_ID + `?bucket_id=${currentBucket}`, {
          headers: { Authorization: "Token " + getToken() },
        })
        .then((res) => handleReceiveFolderData(res.data.data))
        .catch((error) =>
          setAlert(
            <ShowSweetAlert
              type="danger"
              title="Error"
              message={error.response.data.message}
              onClick={handleClickAlert}
            ></ShowSweetAlert>
          )
        );
    } else window.location.href = SELF_URL.LOGIN;
  // eslint-disable-next-line
  }, [currentBucket, update]);

  const handleConfirmDeleteFolder = (id, name) => {
    const message = `Are you sure delete ${name} Folder ?`;
    setAlert(
      <SweetAlert
        warning
        showCancel
        confirmBtnText="Yes, delete it!"
        confirmBtnBsStyle="danger"
        title={message}
        onConfirm={() => handleDeleteFolder(id)}
        onCancel={() => setAlert(null)}
        focusCancelBtn
        closeOnClickOutside={false}
      >
        This file in bucket will be permanently deleted !
      </SweetAlert>
    );
  };

  const handleDeleteFolder = (folder_id) => {
    setIsLoading(true);
    if (currentUser !== null) {
      axios
        .delete(S3_API.DELETE_FOLDER + `?folder_id=${folder_id}`, {
          headers: { Authorization: "Token " + getToken() },
        })
        .then((res) => {
          setUpdate(uuidv4());
          setIsLoading(false);
          setAlert(null);
        })
        .catch((error) => {
          setIsLoading(false);
          setAlert(
            <ShowSweetAlert
              type="danger"
              title="Error"
              message={error.response.data.message}
              onClick={handleClickAlert}
            ></ShowSweetAlert>
          );
        });
    } else window.location.href = SELF_URL.LOGIN;
  };

  const handleClickAlert = () => {
    setAlert(null);
    setIsLoading(false);
  };

  const onFinish = (values) => {
    setIsLoading(true);
    if (currentUser !== null) {
      axios
        .post(
          S3_API.CREATE_FOLDER,
          {
            folder_name: values.folder_name,
            folder_key: values.folder_key,
            bucket_name: currentBucketName,
          },
          {
            headers: { Authorization: "Token " + getToken() },
          }
        )
        .then((res) => {
          setIsLoading(false);
          setUpdate(uuidv4());
          setAlert(
            <ShowSweetAlert
              type="success"
              title="Success"
              message="CREATE FOLDER SUCCESS"
              onClick={handleClickAlert}
            ></ShowSweetAlert>
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
            ></ShowSweetAlert>
          );
        });
    } else history.push(SELF_URL.LOGIN);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  function handleChange(value) {
    if (listAllBucket) {
      const currentBucketFind = listAllBucket.find((item) => {
        return item.id === value;
      });
      setCurrentBucketName(currentBucketFind.bucket_name);
    }
    setCurrentBucket(value);
  }

  const handleReceiveFolderData = (dataRes) => {
    const dataTable = [];
    dataRes &&
      dataRes.map((item) => {
        const newObj = {};
        newObj.id = item.id;
        newObj.folder_name = item.folder_name;
        newObj.folder_key = item.folder_key;
        newObj.created_by = item.created_by;
        newObj.delete_folder = (
          <Button
            type="danger"
            className="ant-btn-sm ant-btn-block"
            onClick={() => handleConfirmDeleteFolder(item.id, item.folder_name)}
          >
            Delete Folder
          </Button>
        );
        return dataTable.push(newObj);
      });
    setIsLoading(false);
    setData(dataTable);
  };

  const handleReceiveData = (dataRes) => {
    const dataTable = [];
    dataRes &&
      dataRes.map((item) => {
        const newObj = {};
        newObj.id = item.id;
        newObj.bucket_name = item.bucket_name;
        newObj.bucket_region = item.bucket_region;
        newObj.created_by = item.created_by;
        newObj.status = (
          <Button
            type="danger"
            className="ant-btn-sm ant-btn-block"
            onClick={() => console.log("Handle Public Access")}
            disabled={item.status}
          >
            Public Access
          </Button>
        );
        return dataTable.push(newObj);
      });

    setDataSelect(dataTable);
    setSelectDefaultValue(dataTable[0].id);
    setCurrentBucket(dataTable[0].id);
    setCurrentBucketName(dataTable[0].bucket_name);
  };

  return (
    <div className="layout-content">
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
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={12} lg={12} xl={14} className="mb-24">
          <Card bordered={false} className="criclebox h-full">
            {dataSelect && selectDefaultValue && (
              <div className="chooseBucketWrapper">
                <span className="chooseBucketLabel">Choose Bucket: </span>
                <Select
                  style={{ width: "50%" }}
                  onChange={handleChange}
                  defaultValue={selectDefaultValue}
                >
                  {dataSelect &&
                    dataSelect.map((item) => (
                      <Option value={item.id}>{item.bucket_name}</Option>
                    ))}
                </Select>
              </div>
            )}
            <div className="table-responsive">
              <Table
                columns={columns}
                dataSource={data}
                pagination={10}
                className="ant-border-space"
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={10} className="mb-24">
          <Card bordered={false} className="criclebox h-full">
            <div style={{ marginBottom: "10px" }}>
              <span>Current Bucket: </span>
              <span className="currentBucketName">{currentBucketName}</span>
            </div>
            <Form
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout="vertical"
              className="row-col"
            >
              <Form.Item
                className="username"
                label="Folder Name"
                name="folder_name"
                rules={[
                  {
                    required: true,
                    message: "Please input Folder name!",
                  },
                ]}
              >
                <Input placeholder="Folder Name" />
              </Form.Item>

              <Form.Item
                className="username"
                label="Folder Key"
                name="folder_key"
                rules={[
                  {
                    required: true,
                    message: "Please input Folder key!",
                  },
                ]}
              >
                <Input placeholder="Folder key" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                  disabled={loading}
                >
                  CREATE FOLDER
                </Button>
              </Form.Item>
            </Form>
            <div className="boxBelowForm">
              <img
                src={S3CreateBucket}
                className="imageBelowBox"
                alt="this is thumb"
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default FolderSetting;
