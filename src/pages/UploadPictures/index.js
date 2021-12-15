import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Col,
  Row,
  Table,
  Button,
  Form,
  Input,
  Select,
  Upload,
  message,
  Typography,
} from "antd";
import { ToTopOutlined, UploadOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import { getUser, getToken } from "utils/common";
import { S3_API, SELF_URL } from "helpers/url";
import { useHistory } from "react-router-dom";
import Loader from "react-loader-spinner";
import axios from "axios";
import { ShowSweetAlert } from "utils/common";
import S3CreateBucket from "assets/images/world.png";
import FolderSettingIcon from "assets/images/folders.png";
import { set } from "lodash";

const UploadPictures = (props) => {
  const { Title, Paragraph, Text, Link } = Typography;
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
  const [currentFolder, setCurrentFolder] = useState(0);
  const [listAllBucket, setListAllBucket] = useState([]);
  const { Option } = Select;
  const [disableFolder, setDisableFolder] = useState(true);
  const [disableBucket, setDisableBucket] = useState(true);
  const [disableApplyButton, setDisableApplyButton] = useState(true);
  const [listFolderOfBucket, setListFolderOfBucket] = useState([]);
  const [listImage, setListImage] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const user = getUser();
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
    } else history.push(SELF_URL.LOGIN);
  }, []);

  const handleFindImage = () => {
    setIsLoading(true);
    const user = getUser();
    if (user !== null) {
      axios
        .get(
          S3_API.GET_IMAGE_BY_FOLDER +
            `?bucket_name=${currentBucketName}&folder_key=${currentFolder}&page=${page}`,
          {
            headers: { Authorization: "Token " + getToken() },
          }
        )
        .then((res) => {
          setIsLoading(false);
          setListImage(res.data.data);
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

  function handleChangeFolder(value) {
    setDisableApplyButton(false);
    setCurrentFolder(value);
  }
  function handleChange(value) {
    const user = getUser();
    if (user !== null) {
      setCurrentUser(user);
      axios
        .get(S3_API.GET_FOLDER_BY_BUCKET_ID + `?bucket_id=${value}`, {
          headers: { Authorization: "Token " + getToken() },
        })
        .then((res) => {
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
        return item.id == value;
      });
      setCurrentBucketName(currentBucketFind.bucket_name);
    }
    setCurrentBucket(value);
  }

  const formProps = {
    name: "files",
    action: S3_API.UPLOAD_IMAGES,
    headers: {
      Authorization: "Token bd3f6cc6247ef2290935a286729c2b93b08b5864",
    },
    data: {
      bucket_name: "nhutnew2",
      folder_key: "s3",
    },
    listType: "picture",
    multiple: true,
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
        handleFindImage();
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
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
                  onClick={handleFindImage}
                  disabled={disableApplyButton ? true : false}
                >
                  Apply
                </Button>
              </Col>
            </Row>
            <Row className="listImageStyle">
              {listImage &&
                listImage.map((item) => 
                <Col span={6}>
                  <img src={item} style={{ width: "150px" }} />
                </Col>
              )}
            </Row>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
          <Card bordered={false} className="criclebox h-auto">
            <Upload {...formProps} className="upload-list-inline">
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

UploadPictures.propTypes = {};

export default UploadPictures;
