import {
  Button,
  Col,
  Row,
  Switch,
  Table,
  Form,
  Input,
  Card,
  InputNumber,
  Modal,
} from "antd";
import React, { useEffect, useState } from "react";
import { EX_CATEGORIES, SELF_URL } from "helpers/url";
import Loader from "react-loader-spinner";
import axios from "axios";
import { getUser, getToken, convertToSlug } from "utils/common";
import { ShowSweetAlert } from "utils/common";
import { v4 as uuidv4 } from "uuid";
import SweetAlert from "react-bootstrap-sweetalert";
import S3CreateBucket from "assets/images/world.png";

const Categories = (props) => {
  const [loading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState("");
  const [checkedSticky, setCheckedSticky] = useState(false);
  const [slugCat, setSlugCat] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editCatName, setEditCatName] = useState("");
  const [editCatSlug, setEditCatSlug] = useState("");
  const [editCatId, setEditCatId] = useState("");
  const [editCatOrder, setEditCatOrder] = useState(0);

  const handleClickAlert = () => {
    setAlert(null);
    setIsLoading(false);
  };

  const showModal = (item) => {
    setIsModalVisible(true);
    setEditCatName(item.category_name);
    setEditCatSlug(item.category_slug);
    setEditCatId(item.id);
    setEditCatOrder(item.order);
  };

  const handleOk = () => {
    const user = getUser();
    if (user !== null) {
      setIsLoading(true);
      axios
        .patch(
          EX_CATEGORIES.REST + editCatId,
          {
            category_name: editCatName,
            category_slug: convertToSlug(editCatSlug),
            order: editCatOrder,
          },
          {
            headers: { Authorization: "Token " + getToken() },
          }
        )
        .then((res) => {
          const message = `Update [${res.data?.data?.category_name}] success`;
          setIsLoading(false);
          setUpdate(uuidv4());
          setIsModalVisible(false);
          setEditCatSlug("");
          setEditCatName("");
          setEditCatId("");
          setEditCatOrder("");
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
    setEditCatSlug("");
    setEditCatName("");
    setEditCatId("");
    setEditCatOrder("");
  };

  const handleConfirmDeleteCat = (id, name) => {
    const message = `Are you sure delete ${name} Category ?`;
    setAlert(
      <SweetAlert
        warning
        showCancel
        confirmBtnText="Yes, delete it!"
        confirmBtnBsStyle="danger"
        title={message}
        onConfirm={() => handleDeleteCat(id)}
        onCancel={() => setAlert(null)}
        focusCancelBtn
        closeOnClickOutside={false}
      >
        This category will be permanently deleted !
      </SweetAlert>
    );
  };

  const handleDeleteCat = (id) => {
    const user = getUser();
    setIsLoading(true);
    if (user !== null) {
      axios
        .delete(EX_CATEGORIES.REST + id, {
          headers: { Authorization: "Token " + getToken() },
        })
        .then((res) => {
          setUpdate(uuidv4());
          setIsLoading(false);
          setAlert(
            <ShowSweetAlert
              type="success"
              title="Success"
              message="DELETE CATEGORY SUCCESS"
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
          EX_CATEGORIES.REST,
          {
            cat_name: values.category_name,
            cat_slug: convertToSlug(slugCat),
            order: values.order,
            sticky: checkedSticky,
          },
          {
            headers: { Authorization: "Token " + getToken() },
          }
        )
        .then((res) => {
          const message = `Create [${values.category_name}] success`;
          setIsLoading(false);
          setUpdate(uuidv4());
          setCheckedSticky(false);
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
    if (categoryName) {
      setSlugCat(convertToSlug(categoryName));
    }
  };

  const handleUpdateSticky = (value) => {
    const user = getUser();
    if (user !== null) {
      setIsLoading(true);
      axios
        .patch(
          EX_CATEGORIES.REST + value.id,
          {
            sticky: !value.sticky,
          },
          {
            headers: { Authorization: "Token " + getToken() },
          }
        )
        .then((res) => {
          const message = `Update [${res.data?.data?.category_name}] sticky state success`;
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
    }
  };

  const columns = [
    {
      title: "Category Name",
      dataIndex: "cat_name",
      key: "cat_name",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Category Slug",
      dataIndex: "cat_slug",
      key: "cat_slug ",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Sticky",
      dataIndex: "sticky",
      key: "sticky ",
      render: (sticky) => (
        <Switch
          checked={sticky.sticky}
          onChange={() => handleUpdateSticky(sticky)}
          checkedChildren="Sticky"
          unCheckedChildren="None"
        />
      ),
    },
    {
      title: "Order",
      dataIndex: "order",
      key: "order ",
      render: (text) => <span>{text}</span>,
      sorter: {
        compare: (a, b) => a.order - b.order,
      },
    },
    {
      title: "Remove",
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
            onClick={() => handleConfirmDeleteCat(item.id, item.category_name)}
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
        .get(EX_CATEGORIES.REST, {
          headers: { Authorization: "Token " + getToken() },
        })
        .then((res) => {
          setIsLoading(false);
          const dataCat = [];
          res.data?.data.map((item) => {
            const newObj = {};
            newObj.cat_name = item.category_name;
            newObj.cat_slug = item.category_slug;
            newObj.order = item.order;
            newObj.sticky = item;
            newObj.remove_cat = item;
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
        title="Edit Category"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <h5>Category Name</h5>
        <Input
          placeholder="Category Name"
          onChange={(e) => setEditCatName(e.target.value)}
          value={editCatName ? editCatName : ""}
        />
        <br />
        <br />
        <h5>Category Slug</h5>
        <Input
          placeholder="Category Slug"
          onChange={(e) => setEditCatSlug(e.target.value)}
          value={editCatSlug ? editCatSlug : ""}
        />
        <br />
        <br />
        <h5>Category Order</h5>
        <InputNumber
          placeholder="Category Order"
          onChange={setEditCatOrder}
          style={{ width: "100%" }}
          min={0}
          value={editCatOrder}
        />
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
              initialValues={{ sticky: false, category_slug: slugCat }}
              layout="vertical"
              className="row-col"
            >
              <Form.Item
                className="category"
                label="Category Name"
                name="category_name"
                rules={[
                  {
                    required: true,
                    message: "Please input category name!",
                  },
                ]}
              >
                <Input
                  placeholder="Category Name"
                  onChange={(e) => setCategoryName(e.target.value)}
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

              <p>Category Slug</p>
              <Input
                placeholder="Category Slug"
                value={slugCat}
                onChange={(e) => setSlugCat(e.target.value)}
              />

              {categoryName && categoryName.length && (
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

              <Form.Item className="category" label="Sticky" name="sticky">
                <Switch
                  checkedChildren="STICKY"
                  unCheckedChildren="NONE"
                  checked={checkedSticky}
                  onChange={setCheckedSticky}
                />
              </Form.Item>

              <Form.Item
                className="category"
                label="Order"
                name="order"
                initialValue={0}
                rules={[
                  {
                    required: true,
                    message: "Please input order!",
                  },
                ]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                  disabled={loading}
                >
                  CREATE CATEGORY
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

export default Categories;
