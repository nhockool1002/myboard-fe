import React, { useState, useEffect } from "react";
import { Card, Col, Row, Table, Button, Form, Input } from "antd";
import { getUser, getToken } from "utils/common";
import { S3_API, SELF_URL } from "helpers/url";
import { useHistory } from "react-router-dom";
import Loader from "react-loader-spinner";
import axios from "axios";
import { ShowSweetAlert } from "utils/common";
import S3CreateBucket from "assets/images/world.png";
import { v4 as uuidv4 } from "uuid";
import SweetAlert from "react-bootstrap-sweetalert";

// table code start
const columns = [
  {
    title: "BUCKET NAME",
    dataIndex: "bucket_name",
    key: "bucket_name",
  },
  {
    title: "BUCKET REGION",
    dataIndex: "bucket_region",
    key: "bucket_region",
  },
  {
    title: "CREATED BY",
    dataIndex: "created_by",
    key: "created_by",
  },
  {
    title: "STATUS",
    dataIndex: "status",
    key: "status",
    width: "30px",
  },
  {
    title: "DELETE",
    dataIndex: "delete_bucket",
    key: "delete_bucket",
    width: "30px",
  },
];

const BucketSettings = (props) => {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [update, setUpdate] = useState(0);

  useEffect(() => {
    const user = getUser();
    if (user !== null) {
      setCurrentUser(user);
      axios
        .get(S3_API.GET_ALL_S3_BUCKET, {
          headers: { Authorization: "Token " + getToken() },
        })
        .then((res) => handleReceiveData(res.data.data))
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
  // eslint-disable-next-line
  }, [update]);

  const handleClickAlert = () => {
    setAlert(null);
    setIsLoading(false);
  };

  const onFinish = (values) => {
    setIsLoading(true);
    if (currentUser !== null) {
      axios
        .post(
          S3_API.S3_CREATE_BUCKET,
          { bucket_name: values.bucket_name },
          {
            headers: { Authorization: "Token " + getToken() },
          }
        )
        .then((res) => {
          handleReceiveData(res.data.data);
          setIsLoading(false);
          setUpdate(1);
          setAlert(
            <ShowSweetAlert
              type="success"
              title="Success"
              message="CREATE BUCKET SUCCESS"
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
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleConfirmDeleteBucket = (id, name) => {
    const message = `Are you sure delete ${name} Bucket ?`;
    setAlert(
      <SweetAlert
        warning
        showCancel
        confirmBtnText="Yes, delete it!"
        confirmBtnBsStyle="danger"
        title={message}
        onConfirm={() => handleDeleteBucket(name)}
        onCancel={() => setAlert(null)}
        focusCancelBtn
        closeOnClickOutside={false}
      >
        This file in bucket will be permanently deleted !
      </SweetAlert>
    );
  };

  const handleDeleteBucket = (name) => {
    setIsLoading(true);
    if (currentUser !== null) {
      axios
        .delete(
          S3_API.DELETE_BUCKET + `?bucket_name=${name}`,
          {
            headers: { Authorization: "Token " + getToken() },
          }
        )
        .then((res) => {
          setUpdate(uuidv4());
          setIsLoading(false);
          setAlert(
            <ShowSweetAlert
              type="success"
              title="Success"
              message="DELETE BUCKET SUCCESS"
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
    } else window.location.href = SELF_URL.LOGIN;
  };

  const handlePublicAccessBucket = (name) => {
    setIsLoading(true);
    if (currentUser !== null) {
      axios
        .post(
          S3_API.PUBLIC_ACCESS_BUCKET,
          { bucket_name: name},
          {
            headers: { Authorization: "Token " + getToken() },
          }
        )
        .then((res) => {
          setUpdate(uuidv4());
          setIsLoading(false);
          setAlert(
            <ShowSweetAlert
              type="success"
              title="Success"
              message="PUBLIC ACCESS BUCKET SUCCESS"
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
    } else window.location.href = SELF_URL.LOGIN;
  }

  const handleReceiveData = (dataRes) => {
    const dataTable = [];
    dataRes &&
      dataRes.map((item) => {
        const newObj = {};
        newObj.bucket_name = item.bucket_name;
        newObj.bucket_region = item.bucket_region;
        newObj.created_by = item.created_by;
        newObj.status = (
          <Button
            type="warning"
            className="ant-btn-sm ant-btn-block btn-public-access"
            onClick={() => handlePublicAccessBucket(item.bucket_name)}
             // eslint-disable-next-line
            disabled={item.status == 0 ? false : true}
          >
            Public Access
          </Button>
        );
        newObj.delete_bucket = (
          <Button
            type="danger"
            className="ant-btn-sm ant-btn-block"
            onClick={() => handleConfirmDeleteBucket(item.id, item.bucket_name)}
          >
            Delete Bucket
          </Button>
        );
        return dataTable.push(newObj);
      });
    setData(dataTable);
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
            <Form
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout="vertical"
              className="row-col"
            >
              <Form.Item
                className="username"
                label="Bucket Name"
                name="bucket_name"
                rules={[
                  {
                    required: true,
                    message: "Please input bucket name!",
                  },
                ]}
              >
                <Input placeholder="Bucket Name" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                  disabled={loading}
                >
                  CREATE BUCKET
                </Button>
              </Form.Item>
            </Form>
            <div className="boxBelowForm">
              <img
                src={S3CreateBucket}
                className="imageBelowBox"
                alt="This is thumb item"
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BucketSettings;
