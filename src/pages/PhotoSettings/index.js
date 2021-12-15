import React, { useState } from "react";
import PropTypes from "prop-types";
import { Card, Col, Row, Typography } from "antd";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { getUser, getToken } from "utils/common";
import { S3_API, SELF_URL } from "helpers/url";
import { ShowSweetAlert } from "utils/common";
import Loader from "react-loader-spinner";
import axios from "axios";

import PhotoBucket from "assets/images/ice-bucket.png";
import FolderSetting from "assets/images/folders.png";
import UploadImage from "assets/images/upload.png";

import { isEmpty } from "lodash";

const PhotoSettings = (props) => {
  const { Title } = Typography;
  const history = useHistory();
  const [alert, setAlert] = useState(null);
  const [loading, setIsLoading] = useState(false);
  const user = getUser();

  const handleClickAlert = () => {
    setAlert(null);
    setIsLoading(false);
  };


  const handleTransitionBucket = () => {
    setAlert(null);
    history.push(SELF_URL.BUCKET_MANAGEMENT);
  };

  const handleRedirect = (page) => {
    switch (page) {
      case 1:
        history.push(SELF_URL.BUCKET_MANAGEMENT);
        break;
      case 2:
        setIsLoading(true);
        if (user !== null) {
          axios
            .get(S3_API.GET_ALL_S3_BUCKET, {
              headers: { Authorization: "Token " + getToken() },
            })
            .then((res) => {
              setIsLoading(false);
              if (isEmpty(res.data.data)) {
                console.log(213)
                setAlert(
                  <ShowSweetAlert
                    type="danger"
                    title="Error"
                    message="FIRST CREATE BUCKET"
                    onClick={handleTransitionBucket}
                  ></ShowSweetAlert>
                );
              } else history.push(SELF_URL.FOLDER_MANAGEMENT);
            })
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
        break;
      case 3:
        history.push(SELF_URL.UPLOAD_PICTURE);
        break;
      default:
        history.push(SELF_URL.DASHBOARD);
        break;
    }
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
      <Row className="rowgap-vbox" gutter={[24, 0]}>
        <Col
          key={uuidv4()}
          xs={24}
          sm={24}
          md={12}
          lg={6}
          xl={6}
          className="mb-24"
        >
          <Card
            bordered={false}
            className="criclebox boxSettings"
            onClick={() => handleRedirect(1)}
          >
            <div className="number">
              <Row align="middle" gutter={[24, 0]}>
                <Col xs={18}>
                  <Title level={4}>
                    <small className="bnb2">
                      Management Bucket on S3 Server
                    </small>{" "}
                    Bucket Settings
                  </Title>
                </Col>
                <Col xs={6}>
                  <div className="icon-box icon-box-custom">
                    <img className="iconImg" src={PhotoBucket} />
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
        <Col
          key={uuidv4()}
          xs={24}
          sm={24}
          md={12}
          lg={6}
          xl={6}
          className="mb-24"
        >
          <Card
            bordered={false}
            className="criclebox boxSettings"
            onClick={() => handleRedirect(2)}
            disabled={true}
          >
            <div className="number">
              <Row align="middle" gutter={[24, 0]}>
                <Col xs={18}>
                  <Title level={4}>
                    <small className="bnb2">
                      Management Folders in Buckets
                    </small>{" "}
                    Folders Settings
                  </Title>
                </Col>
                <Col xs={6}>
                  <div className="icon-box icon-box-custom">
                    <img className="iconImg" src={FolderSetting} />
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
        <Col
          key={uuidv4()}
          xs={24}
          sm={24}
          md={12}
          lg={6}
          xl={6}
          className="mb-24"
        >
          <Card
            bordered={false}
            className="criclebox boxSettings"
            onClick={() => handleRedirect(3)}
            disabled={true}
          >
            <div className="number">
              <Row align="middle" gutter={[24, 0]}>
                <Col xs={18}>
                  <Title level={4}>
                    <small className="bnb2">
                      Management Picture in Folders
                    </small>{" "}
                    Upload Pictures
                  </Title>
                </Col>
                <Col xs={6}>
                  <div className="icon-box icon-box-custom">
                    <img className="iconImg" src={UploadImage} />
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

PhotoSettings.propTypes = {};

export default PhotoSettings;
