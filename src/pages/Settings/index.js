import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Card, Col, Row, Button, Form, Input, Upload, message } from "antd";
import { getUser, getToken } from "utils/common";
import { SETTING_API, SELF_URL } from "helpers/url";
import Loader from "react-loader-spinner";
import { v4 as uuidv4 } from "uuid";

import { ShowSweetAlert, ReactQuillToolbar } from "utils/common";
import ExamplePhoto from "assets/images/example.png";
import { UploadOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Settings = (props) => {
  const [update, setUpdate] = useState(0);
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const history = useHistory();
  const [titleSetting, setTitleSetting] = useState("");
  const [descriptionSetting, setDescriptionSetting] = useState("");
  const [footerSetting, setFooterSetting] = useState("");
  const [thumbSetting, setThumbSetting] = useState("");
  const [favSetting, setFavSetting] = useState("");
  const [moneyExchangeUrlSetting, setMoneyExchangeUrlSetting] = useState("");
  const [moneyExchangeKeySetting, setMoneyExchangeKeySetting] = useState("");
  const reactQuillSetting = ReactQuillToolbar();

  const formProps = {
    name: "file",
    action: SETTING_API.UPDADTE_THUMB_SETTINGS,
    headers: {
      Authorization: "Token " + getToken(),
    },
    data: {
      type: "thumb",
    },
    listType: "picture",
    multiple: false,
    maxCount: 1,
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
        setUpdate(uuidv4());
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    accept: ".jpg,.jpeg,.png",
    progress: {
      width: "90%",
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      strokeWidth: 2,
      format: (percent) => `${parseFloat(percent.toFixed(2))}%`,
    },
  };

  const formPropsFav = {
    name: "file",
    action: SETTING_API.UPDADTE_THUMB_SETTINGS,
    headers: {
      Authorization: "Token " + getToken(),
    },
    data: {
      type: "fav",
    },
    listType: "picture",
    multiple: false,
    maxCount: 1,
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
        setUpdate(uuidv4());
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    accept: ".png",
    progress: {
      width: "90%",
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      strokeWidth: 2,
      format: (percent) => `${parseFloat(percent.toFixed(2))}%`,
    },
  };

  useEffect(() => {
    setIsLoading(true);
    const user = getUser();
    if (user !== null) {
      setCurrentUser(user);
      axios
        .get(SETTING_API.GET_GENERAL_SETTINGS, {
          headers: { Authorization: "Token " + getToken() },
        })
        .then((res) => {
          setIsLoading(false);
          res.data.data.map((item) => {
            return setDataValue(item.setting_key, item.setting_value);
          });
        })
        .catch((error) => {
          setIsLoading(true);
          setAlert(
            <ShowSweetAlert
              type="danger"
              title="Error"
              message={error.response}
              onClick={handleClickAlert}
            ></ShowSweetAlert>
          );
        });
    } else window.location.href = SELF_URL.LOGIN;
    // eslint-disable-next-line
  }, [update]);

  const setDataValue = (item, value) => {
    switch (item) {
      case "title":
        setTitleSetting(value);
        break;
      case "description":
        setDescriptionSetting(value);
        break;
      case "footer":
        setFooterSetting(value);
        break;
      case "thumb_image":
        setThumbSetting(value);
        break;
      case "fav_image":
        setFavSetting(value);
        break;
      case "money_exchange_domain":
        setMoneyExchangeUrlSetting(value);
        break;
      case "money_exchange_key":
        setMoneyExchangeKeySetting(value);
        break;
      default:
        break;
    }
  };

  const onFinish = (value, item) => {
    setIsLoading(true);
    setDataValue(item, value[item]);
    const message = `Setting ${item} success!`;
    if (currentUser !== null) {
      axios
        .post(
          SETTING_API.UPDADTE_GENERAL_SETTINGS,
          {
            setting_key: item,
            setting_value: value[item],
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
              message={message}
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

  const onFinishFailed = (item) => {
    const message = `Setting ${item} failed!`;
    console.log("Failed:", message);
  };

  const handleClickAlert = () => {
    setAlert(null);
    setIsLoading(false);
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
      <Row>
        <Col span={24} style={{ padding: "20px" }}>
          <div className="textNotice" onClick={() => window.location.reload()}>
            Refresh to effect
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={12} xs={24} className="boxSetting">
          <Card title="General Settings" bordered={false}>
            <Form
              onFinish={(value) => onFinish(value, "title")}
              onFinishFailed={() => onFinishFailed("title")}
              layout="vertical"
              className="row-col setting-wrapper"
              fields={[
                {
                  name: ["title"],
                  value: titleSetting ? titleSetting : "",
                },
              ]}
            >
              <Card
                title="Title"
                type="inner"
                bordered={false}
                actions={[
                  <Form.Item>
                    <Button
                      type="primary"
                      className="ant-btn-sm ant-btn-setting"
                      disabled={loading}
                      htmlType="submit"
                    >
                      Save
                    </Button>
                  </Form.Item>,
                ]}
              >
                <Form.Item
                  className="title"
                  name="title"
                  rules={[
                    {
                      required: true,
                      message: "Please input your title!",
                    },
                  ]}
                >
                  <Input placeholder="Title" />
                </Form.Item>
              </Card>
            </Form>
            <Form
              onFinish={(value) => onFinish(value, "description")}
              onFinishFailed={() => onFinishFailed("description")}
              layout="vertical"
              className="row-col setting-wrapper"
              fields={[
                {
                  name: ["description"],
                  value: descriptionSetting ? descriptionSetting : "",
                },
              ]}
            >
              <Card
                title="Description"
                type="inner"
                bordered={false}
                actions={[
                  <Form.Item>
                    <Button
                      type="primary"
                      className="ant-btn-sm ant-btn-setting"
                      disabled={loading}
                      htmlType="submit"
                    >
                      Save
                    </Button>
                  </Form.Item>,
                ]}
              >
                <Form.Item
                  className="description"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Please input your description!",
                    },
                  ]}
                >
                  <Input placeholder="Description" />
                </Form.Item>
              </Card>
            </Form>
            <Card
              title="Footer"
              type="inner"
              bordered={false}
              className="row-col setting-wrapper react-quill"
              actions={[
                <Button
                  type="primary"
                  className="ant-btn-sm ant-btn-setting"
                  disabled={loading}
                  onClick={() => onFinish({ footer: footerSetting }, "footer")}
                >
                  Save
                </Button>,
              ]}
            >
              <ReactQuill
                theme="snow"
                value={footerSetting}
                onChange={setFooterSetting}
                modules={reactQuillSetting.modules}
                formats={reactQuillSetting.formats}
                className="reactBoxSetting"
              />
            </Card>
          </Card>
        </Col>
        <Col md={12} xs={24} className="boxSetting">
          <Card title="Social Settings" bordered={false}>
            <Card
              title="Thumbnail"
              type="inner"
              bordered={false}
              className="row-col setting-wrapper react-quill"
            >
              <Row>
                <Col span={12}>
                  <div className="boxImgThumbSetting">
                    <img
                      src={thumbSetting ? thumbSetting : ExamplePhoto}
                      style={{ width: "150px" }}
                      alt="This is Thumb setting img"
                    />
                  </div>
                </Col>
                <Col span={12} className="boxUploadThumbSetting">
                  <Upload {...formProps} className="upload-list-inline">
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                  </Upload>
                </Col>
              </Row>
              <br />
              <br />
            </Card>
            <Card
              title="Favicon"
              type="inner"
              bordered={false}
              className="row-col setting-wrapper react-quill"
            >
              <Row>
                <Col span={12}>
                  <div className="boxImgThumbSetting">
                    <img
                      src={favSetting ? favSetting : ExamplePhoto}
                      style={{ width: "50px" }}
                      alt="This is Thumb setting favicon"
                    />
                  </div>
                </Col>
                <Col span={12} className="boxUploadThumbSettingFav">
                  <Upload {...formPropsFav} className="upload-list-inline">
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                  </Upload>
                </Col>
              </Row>
              <br />
              <br />
            </Card>
          </Card>
          <br />
          <Card title="Money Exchange Settings" bordered={false}>
            <Form
              name="basic"
              onFinish={(value) => onFinish(value, "money_exchange_domain")}
              onFinishFailed={() => onFinishFailed("money_exchange_domain")}
              autoComplete="off"
              fields={[
                {
                  name: ["money_exchange_domain"],
                  value: moneyExchangeUrlSetting ? moneyExchangeUrlSetting : "",
                }
              ]}
            >
              <Card
                type="inner"
                bordered={false}
                className="row-col setting-wrapper react-quill"
              >
                <Row>
                  <Col md={18} lg={18} sm={24} xs={24}>
                    <Form.Item
                      label="URL"
                      name="money_exchange_domain"
                      rules={[
                        {
                          required: true,
                          message: "Please input money exchange URL!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col md={6} lg={6} sm={24} xs={24}>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="ant-btn-sm ant-btn-setting"
                      >
                        Save
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
                <br />
                <br />
              </Card>
            </Form>
            <Form
              name="basic"
              onFinish={(value) => onFinish(value, "money_exchange_key")}
              onFinishFailed={() => onFinishFailed("money_exchange_key")}
              autoComplete="off"
              fields={[
                {
                  name: ["money_exchange_key"],
                  value: moneyExchangeKeySetting ? moneyExchangeKeySetting : "",
                }
              ]}
            >
              <Card
                type="inner"
                bordered={false}
                className="row-col setting-wrapper react-quill"
              >
                <Row>
                  <Col md={18} lg={18} sm={24} xs={24}>
                    <Form.Item
                      label="KEY"
                      name="money_exchange_key"
                      rules={[
                        {
                          required: true,
                          message: "Please input money exchange apikey!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col md={6} lg={6} sm={24} xs={24}>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="ant-btn-sm ant-btn-setting"
                      >
                        Save
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
                <br />
                <br />
              </Card>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Settings;
