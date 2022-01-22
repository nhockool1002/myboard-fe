import {
  Button,
  Col,
  Row,
  Select,
  Table,
  Form,
  Input,
  Card,
  Modal,
} from "antd";
import React, { useEffect, useState } from "react";
import { EX_LABELS, SELF_URL } from "helpers/url";
import Loader from "react-loader-spinner";
import axios from "axios";
import { getUser, getToken, convertToSlug } from "utils/common";
import { ShowSweetAlert } from "utils/common";
import { v4 as uuidv4 } from "uuid";
import SweetAlert from "react-bootstrap-sweetalert";
import S3CreateBucket from "assets/images/world.png";

const Labels = (props) => {
  const [loading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState("");
  const [slugCat, setSlugCat] = useState("");
  const [labelName, setLabelName] = useState("");
  const [labelType, setLabelType] = useState("post");
  const [labelTypeValue, setLabelTypeValue] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editLabelName, setEditLabelName] = useState("");
  const [editLabelSlug, setEditLabelSlug] = useState("");
  const [editLabelType, setEditLabelType] = useState(0);
  const [editLabelTypeValue, setEditLabelTypeValue] = useState("");
  const [editLabeld, setEditLabelId] = useState("");
  const { Option } = Select;

  const handleClickAlert = () => {
    setAlert(null);
    setIsLoading(false);
  };

  const handleChange = (value) => {
    if (value === "post") {
      setLabelTypeValue(1);
    } else if (value === "source") {
      setLabelTypeValue(2);
    } else if (value === "project") {
      setLabelTypeValue(3);
    }
    setLabelType(value);
  };

  const showModal = (item) => {
    setIsModalVisible(true);
    setEditLabelName(item.label_name);
    setEditLabelSlug(item.label_slug);
    setEditLabelId(item.id);
    if (item.label_type === 1) {
      setEditLabelTypeValue("post");
    } else if (item.label_type === 2) {
      setEditLabelTypeValue("source");
    } else if (item.label_type === 3) {
      setEditLabelTypeValue("project");
    }
  };

  const handleChangeEditLabel = (value) => {
    if (value === "post") {
      setEditLabelType(1);
    } else if (value === "source") {
      setEditLabelType(2);
    } else if (value === "project") {
      setEditLabelType(3);
    }
    setEditLabelTypeValue(value);
  };

  const renderNameLabelType = (value) => {
    if (value === 1) {
      return "POST"
    } else if (value === 2) {
      return "SOURCE"
    } else if (value ===3) {
      return "PROJECT"
    } else {
      return ""
    }
  }

  const handleOk = () => {
    const user = getUser();
    if (user !== null) {
      setIsLoading(true);
      axios
        .patch(
          EX_LABELS.REST + editLabeld,
          {
            label_name: editLabelName,
            label_slug: convertToSlug(editLabelSlug),
            label_type: editLabelType,
          },
          {
            headers: { Authorization: "Token " + getToken() },
          }
        )
        .then((res) => {
          const message = `Update [${res.data?.data?.label_name}] success`;
          setIsLoading(false);
          setUpdate(uuidv4());
          setIsModalVisible(false);
          setEditLabelSlug("");
          setEditLabelName("");
          setEditLabelId("");
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
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditLabelSlug("");
    setEditLabelName("");
    setEditLabelId("");
  };

  const handleConfirmDeleteLabel = (id, name) => {
    const message = `Are you sure delete ${name} Label ?`;
    setAlert(
      <SweetAlert
        warning
        showCancel
        confirmBtnText="Yes, delete it!"
        confirmBtnBsStyle="danger"
        title={message}
        onConfirm={() => handleDeleteLabel(id)}
        onCancel={() => setAlert(null)}
        focusCancelBtn
        closeOnClickOutside={false}
      >
        This label will be permanently deleted !
      </SweetAlert>
    );
  };

  const handleDeleteLabel = (id) => {
    const user = getUser();
    setIsLoading(true);
    if (user !== null) {
      axios
        .delete(EX_LABELS.REST + id, {
          headers: { Authorization: "Token " + getToken() },
        })
        .then((res) => {
          setUpdate(uuidv4());
          setIsLoading(false);
          setAlert(
            <ShowSweetAlert
              type="success"
              title="Success"
              message="DELETE LABEL SUCCESS"
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

  const onFinish = (values) => {
    const user = getUser();
    if (user !== null) {
      setIsLoading(true);
      axios
        .post(
          EX_LABELS.REST,
          {
            label_name: values.label_name,
            label_slug: convertToSlug(slugCat),
            label_type: labelTypeValue,
          },
          {
            headers: { Authorization: "Token " + getToken() },
          }
        )
        .then((res) => {
          const message = `Create [${values.label_name}] success`;
          setIsLoading(false);
          setUpdate(uuidv4());
          setSlugCat(convertToSlug(slugCat));
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
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleSetSlug = () => {
    if (labelName) {
      setSlugCat(convertToSlug(labelName));
    }
  };

  const columns = [
    {
      title: "Label Name",
      dataIndex: "label_name",
      key: "label_name",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Label Slug",
      dataIndex: "label_slug",
      key: "label_slug ",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Label Type",
      dataIndex: "label_type",
      key: "label_type ",
      render: (text) => <span>{renderNameLabelType(text)}</span>,
      sorter: {
        compare: (a, b) => a.label_type - b.label_type,
      },
    },
    {
      title: "Option",
      dataIndex: "remove_cat",
      key: "remove_cat",
      render: (item) => (
        <>
          <Button
            type="primary"
            className="ant-btn-sm ant-btn-block"
            style={{ width: "80px", marginRight: "10px" }}
            onClick={() => showModal(item)}
          >
            Edit
          </Button>
          <Button
            type="danger"
            className="ant-btn-sm ant-btn-block"
            style={{ width: "80px" }}
            onClick={() => handleConfirmDeleteLabel(item.id, item.label_name)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  useEffect(() => {
    const user = getUser();
    if (user !== null) {
      setIsLoading(true);
      axios
        .get(EX_LABELS.REST, {
          headers: { Authorization: "Token " + getToken() },
        })
        .then((res) => {
          setIsLoading(false);
          const dataCat = [];
          res.data?.data.map((item) => {
            const newObj = {};
            newObj.label_name = item.label_name;
            newObj.label_slug = item.label_slug;
            newObj.remove_cat = item;
            newObj.label_type = item.label_type;
            return dataCat.push(newObj);
          });
          setData(dataCat);
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
    }
  }, [update]);

  return (
    <>
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
      <Modal
        title="Edit Label"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <h5>Label Name</h5>
        <Input
          placeholder="Category Name"
          onChange={(e) => setEditLabelName(e.target.value)}
          value={editLabelName ? editLabelName : ""}
        />
        <br />
        <br />
        <h5>Label Slug</h5>
        <Input
          placeholder="Category Slug"
          onChange={(e) => setEditLabelSlug(e.target.value)}
          value={editLabelSlug ? editLabelSlug : ""}
        />

        <br />
        <br />

        <Select
          style={{ width: "100%" }}
          onChange={handleChangeEditLabel}
          value={editLabelTypeValue}
        >
          <Option value="post">Post</Option>
          <Option value="source">Source</Option>
          <Option value="project">Project</Option>
        </Select>
      </Modal>
      <Row>
        <Col lg={12} md={12} xs={24} sm={24}>
          <Table
            columns={columns}
            dataSource={data}
            style={{ width: "95%" }}
            className="table-responsive"
          />
        </Col>
        <Col lg={12} md={12} xs={24} sm={24}>
          <Card bordered={false} className="criclebox h-full">
            <Form
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              initialValues={{ label_slug: slugCat }}
              layout="vertical"
              className="row-col"
            >
              <Form.Item
                className="category"
                label="Label Name"
                name="label_name"
                rules={[
                  {
                    required: true,
                    message: "Please input category name!",
                  },
                ]}
              >
                <Input
                  placeholder="Label Name"
                  onChange={(e) => setLabelName(e.target.value)}
                />
              </Form.Item>
              {/* <Form.Item
                className="category"
                label="Category Slug"
                name="category_slug"
                rules={[
                  {
                    required: true,
                    message: "Please input category slug!",
                  },
                ]}
              >
                <Input placeholder="Category Slug" value={slugCat} onChange={setSlugCat} />
              </Form.Item> */}

              <p>Label Slug</p>
              <Input
                placeholder="Label Slug"
                value={slugCat}
                onChange={(e) => setSlugCat(e.target.value)}
              />

              {labelName && labelName.length && (
                <Button
                  type="ghost"
                  style={{ width: "100%", margin: "10px 0px" }}
                  disabled={loading}
                  onClick={handleSetSlug}
                >
                  GENERATE SLUG
                </Button>
              )}

              <br />
              <br />

              <Select
                defaultValue={labelType}
                style={{ width: "100%" }}
                onChange={handleChange}
              >
                <Option value="post">Post</Option>
                <Option value="source">Source</Option>
                <Option value="project">Project</Option>
              </Select>

              <br />
              <br />

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                  disabled={loading}
                >
                  CREATE LABEL
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
    </>
  );
};

export default Labels;
