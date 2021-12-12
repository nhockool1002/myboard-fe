import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card, Col, Row, Table, Button, Form, Input } from "antd";
import { v4 as uuidv4 } from "uuid";
import { getUser, getToken } from "utils/common";
import { S3_API, SELF_URL } from "helpers/url";
import { useHistory } from "react-router-dom";
import Loader from "react-loader-spinner";
import axios from "axios";
import { ShowSweetAlert } from "utils/common";
import S3CreateBucket from "assets/images/world.png";

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
              type="error"
              title="Error"
              message={error.response}
              onClick={handleClickAlert}
            ></ShowSweetAlert>
          )
        );
    } else history.push(SELF_URL.LOGIN);
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
              type="error"
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
            type="danger"
            className="ant-btn-sm ant-btn-block"
            onClick={() => console.log("Handle Public Access")}
            disabled={item.status}
          >
            Public Access
          </Button>
        );
        dataTable.push(newObj);
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
              <img src={S3CreateBucket} className="imageBelowBox" />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

BucketSettings.propTypes = {};

export default BucketSettings;
