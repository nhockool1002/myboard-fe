import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Row, Typography } from "antd";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { SELF_URL } from "helpers/url";

import PhotoBucket from "assets/images/ice-bucket.png";
import FolderSetting from "assets/images/folders.png";

const PhotoSettings = (props) => {
  const { Title } = Typography;
  const history = useHistory();
  const handleRedirect = (page) => {
    switch (page) {
      case 1:
        history.push(SELF_URL.BUCKET_MANAGEMENT);
        break;
      case 2:
        history.push(SELF_URL.FOLDER_MANAGEMENT);
        break;
      
      default:
        history.push(SELF_URL.DASHBOARD);
        break;
    }
  };
  return (
    <div className="layout-content">
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
      </Row>
    </div>
  );
};

PhotoSettings.propTypes = {};

export default PhotoSettings;
