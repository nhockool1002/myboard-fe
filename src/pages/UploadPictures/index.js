import React, { useState, useEffect } from "react";
import {
  Card,
  Col,
  Row,
  Button,
  Select,
  Upload,
  message,
  Typography,
  Pagination,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getUser, getToken } from "utils/common";
import { S3_API, SELF_URL } from "helpers/url";
import { useHistory } from "react-router-dom";
import Loader from "react-loader-spinner";
import SweetAlert from "react-bootstrap-sweetalert";
import axios from "axios";
import { ShowSweetAlert } from "utils/common";
import { SRLWrapper } from "simple-react-lightbox";

import DeleteIcon from "assets/images/delete.png";

const UploadPictures = (props) => {
  const { Text } = Typography;
  const history = useHistory();
  const [loading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentBucketName, setCurrentBucketName] = useState("");
  const [currentFolder, setCurrentFolder] = useState(0);
  const [listAllBucket, setListAllBucket] = useState([]);
  const { Option } = Select;
  const [disableFolder, setDisableFolder] = useState(true);
  const [disableBucket, setDisableBucket] = useState(true);
  const [disableApplyButton, setDisableApplyButton] = useState(true);
  const [listFolderOfBucket, setListFolderOfBucket] = useState([]);
  const [listImage, setListImage] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState(false);
  const [rowPerPage, setRowPerPage] = useState(0);
  const [selectedFolder, setSelectedFolder] = useState();

  useEffect(() => {
    const user = getUser();
    setCurrentUser(user);
    if (user !== null) {
      setCurrentUser(user);
      axios
        .get(S3_API.GET_ALL_S3_BUCKET, {
          headers: { Authorization: "Token " + getToken() },
        })
        .then((res) => {
          setDisableBucket(false);
          setListAllBucket(res.data.data);
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

  const handleFindImage = (currentPage) => {
    setIsLoading(true);
    const user = getUser();
    if (user !== null) {
      axios
        .get(
          S3_API.GET_IMAGE_BY_FOLDER +
            `?bucket_name=${currentBucketName}&folder_key=${currentFolder}&page=${currentPage}`,
          {
            headers: { Authorization: "Token " + getToken() },
          }
        )
        .then((res) => {
          setIsLoading(false);
          setListImage(res.data.data);
          setTotal(res.data.total);
          setPagination(true);
          setRowPerPage(res.data.row_per_page);
        })
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
    } else history.push(SELF_URL.LOGIN);
  };

  const handleClickAlert = () => {
    setAlert(null);
    setIsLoading(false);
  };

  const handleConfirmDelete = (id) => {
    setAlert(
      <SweetAlert
        warning
        showCancel
        confirmBtnText="Yes, delete it!"
        confirmBtnBsStyle="danger"
        title="Are you sure?"
        onConfirm={() => comfirmedDeleteFile(id)}
        onCancel={() => setAlert(null)}
        focusCancelBtn
      >
        You will not be able to recover this imaginary file!
      </SweetAlert>
    );
  };

  const comfirmedDeleteFile = (id) => {
    setAlert(null);
    setIsLoading(true);
    if (currentUser !== null) {
      axios
        .delete(S3_API.DELETE_FILE_BY_ID + `?file_id=${id}`, {
          headers: { Authorization: "Token " + getToken() },
        })
        .then((res) => {
          setIsLoading(false);
          handleFindImage(page);
        })
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
  };

  const handleChangePage = (page_num) => {
    setPage(page_num);
    handleFindImage(page_num);
  };

  function handleChangeFolder(value) {
    setDisableApplyButton(false);
    setSelectedFolder(value);
    setCurrentFolder(value);
  }
  function handleChange(value) {
    setSelectedFolder(null);
    const user = getUser();
    if (user !== null) {
      setCurrentUser(user);
      axios
        .get(S3_API.GET_FOLDER_BY_BUCKET_ID + `?bucket_id=${value}`, {
          headers: { Authorization: "Token " + getToken() },
        })
        .then((res) => {
          setDisableApplyButton(true);
          setDisableFolder(false);
          setListFolderOfBucket(res.data.data);
        })
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
    } else history.push(SELF_URL.LOGIN);
    if (listAllBucket) {
      const currentBucketFind = listAllBucket.find((item) => {
        return item.id === value;
      });
      setCurrentBucketName(currentBucketFind.bucket_name);
    }
  }

  const formProps = {
    name: "files",
    action: S3_API.UPLOAD_IMAGES,
    headers: {
      Authorization: "Token " + getToken(),
    },
    data: {
      bucket_name: currentBucketName,
      folder_key: currentFolder,
    },
    listType: "picture",
    multiple: true,
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
        handleFindImage(page);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    accept: ".jpg,.jpeg,.png,.mp4,.mov",
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
        <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
          <Card bordered={false} className="criclebox h-full">
            <Row>
              <Col span={8}>
                <Text>Bucket Name: </Text>
                <Select
                  style={{ width: "90%" }}
                  onChange={handleChange}
                  disabled={disableBucket}
                >
                  {listAllBucket &&
                    listAllBucket.map((item) => (
                      <Option value={item.id}>{item.bucket_name}</Option>
                    ))}
                </Select>
              </Col>
              <Col span={10}>
                <Text>Folder: </Text>
                <Select
                  style={{ width: "90%" }}
                  disabled={disableFolder}
                  onChange={handleChangeFolder}
                  value={selectedFolder}
                >
                  {listFolderOfBucket &&
                    listFolderOfBucket.map((item) => (
                      <Option value={item.folder_key}>
                        Name: [{item.folder_name}] - Key: [{item.folder_key}]
                      </Option>
                    ))}
                </Select>
              </Col>
              <Col span={6}>
                <Button
                  type="danger"
                  className="ant-btn-sm ant-btn-block applyFindImage"
                  onClick={() => {
                    setPage(1);
                    handleFindImage(1);
                  }}
                  disabled={disableApplyButton ? true : false}
                >
                  Apply
                </Button>
              </Col>
            </Row>
            <Row className="listImageStyle">
              {listImage &&
                listImage.map((item) => (
                  <Col span={6} style={{ padding: 10 }}>
                    <div className="imageWrapper">
                      <div
                        className="deleteButton"
                        onClick={(e) => handleConfirmDelete(item.id)}
                      >
                        <img
                          src={DeleteIcon}
                          srl_gallery_image="true"
                          alt="delete thumb button"
                        />
                      </div>
                      <SRLWrapper>
                        {item.file_type === "image" ? (
                          <a href={item.url}>
                            <img
                              src={item.url}
                              style={{ width: "100%" }}
                              className="imageItem"
                              alt="item data thumb"
                            />
                          </a>
                        ) : (
                          <video
                            style={{ width: "100%" }}
                            className="imageItem"
                          >
                            <source src={item.url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </SRLWrapper>
                    </div>
                  </Col>
                ))}
            </Row>
            <Row>
              <Col span={24}>
                {pagination && (
                  <Pagination
                    defaultCurrent={1}
                    current={page}
                    defaultPageSize={rowPerPage ? rowPerPage : 12}
                    total={total ? total : 10}
                    onChange={(value) => handleChangePage(value)}
                    showTotal={(total, range) =>
                      `${range[0]}-${range[1]} of ${total ? total : 10} items`
                    }
                    hideOnSinglePage={true}
                    responsive={true}
                  />
                )}
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
          <Card bordered={false} className="criclebox h-auto">
            <Upload {...formProps} className="upload-list-inline">
              <Button icon={<UploadOutlined />} disabled={disableApplyButton}>
                Click to Upload
              </Button>
            </Upload>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UploadPictures;
