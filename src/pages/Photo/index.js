import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Card, Col, Row, Typography, Select } from "antd";
import { getUser, getToken } from "utils/common";
import { S3_API, SELF_URL } from "helpers/url";
import Loader from "react-loader-spinner";
import { isEmpty } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { HiLink } from "react-icons/hi";

import { ShowSweetAlert, dateFormat } from "utils/common";
import ExamplePhoto from "assets/images/example.png";

const Photo = (props) => {
  const { Title } = Typography;
  const { Option } = Select;
  const [update] = useState(0);
  const [currentBucket, setCurrentBucket] = useState({});
  const [listBucket, setListBucket] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [listFolder, setListFolder] = useState([]);
  const history = useHistory();

  useEffect(() => {
    setIsLoading(true);
    const user = getUser();
    if (user !== null) {
      setCurrentUser(user);
      axios
        .get(S3_API.GET_ALL_S3_BUCKET, {
          headers: { Authorization: "Token " + getToken() },
        })
        .then((res) => handleBucketReceive(res.data.data))
        .catch((error) => {
          setIsLoading(false);
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

  useEffect(() => {
    setIsLoading(true);
    if (currentUser !== null && !isEmpty(currentBucket)) {
      axios
        .get(
          S3_API.GET_FOLDER_BY_BUCKET_ID + `?bucket_id=${currentBucket.id}`,
          {
            headers: { Authorization: "Token " + getToken() },
          }
        )
        .then((res) => {
          setIsLoading(false);
          setListFolder(res.data.data);
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
    }
    // eslint-disable-next-line
  }, [currentBucket]);

  const handleBucketReceive = (data) => {
    setListBucket(data);
    setCurrentBucket(data[0]);
    setIsLoading(false);
  };

  const handleClickAlert = () => {
    setAlert(null);
    setIsLoading(false);
  };

  const handleChange = (value) => {
    if (listBucket) {
      const bucket = listBucket.find((item) => {
        return item.id === value;
      });
      setCurrentBucket(bucket);
    }
  };

  const handleRedirectDetail = (folder) => {
    history.push(
      SELF_URL.PHOTO_DETAIL +
        `/${folder.folder_key}/${currentBucket.bucket_name}?page=1`
    );
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
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Card bordered={false} className="">
            {listBucket && currentBucket && (
              <div className="chooseBucketWrapper">
                <Select
                  style={{ width: "25%" }}
                  onChange={handleChange}
                  defaultValue={currentBucket.id}
                  value={currentBucket.id}
                >
                  {listBucket &&
                    listBucket.map((item) => (
                      <Option value={item.id}>{item.bucket_name}</Option>
                    ))}
                </Select>
              </div>
            )}
          </Card>
        </Col>
      </Row>
      <Row className="rowgap-vbox" gutter={[12, 0]}>
        {listFolder &&
          listFolder.map((item) => (
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
                className="criclebox photoBox"
                onClick={() => handleRedirectDetail(item)}
              >
                <div className="number">
                  <Row align="middle" gutter={[24, 0]}>
                    <Col xs={24}>
                      <div
                        style={{
                          width: "100%",
                          height: "200px",
                          backgroundImage: item.image_thumb
                            ? `url(${item.image_thumb})`
                            : `url(${ExamplePhoto})`,
                          backgroundPosition: "center center",
                          backgroundSize: "cover",
                          backgroundRepeat: "no-repeat",
                        }}
                      ></div>
                      <Title level={4}>
                        {item.folder_name ? item.folder_name : ""}
                      </Title>
                      <div className="bnb85">
                        <HiLink /> {item.created_at ? dateFormat(item.created_at) : ""}
                      </div>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
          ))}
      </Row>
    </div>
  );
};

export default Photo;
