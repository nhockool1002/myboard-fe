import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, Col, Row, Pagination } from "antd";
import { getUser, getToken } from "utils/common";
import { S3_API, SELF_URL } from "helpers/url";
import Loader from "react-loader-spinner";

import { ShowSweetAlert } from "utils/common";
import { useHistory } from "react-router-dom";
import ExamplePhoto from "assets/images/example.png";
import { SRLWrapper } from "simple-react-lightbox";
import { v4 as uuidv4 } from "uuid";

const PhotoDetail = (props) => {
  const history = useHistory();
  const [loading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const { folder_key, bucket_name } = useParams();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState(false);
  const [rowPerPage, setRowPerPage] = useState(0);
  const [listImage, setListImage] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    const user = getUser();
    if (user !== null) {
      axios
        .get(
          S3_API.GET_IMAGE_BY_FOLDER +
            `?bucket_name=${bucket_name}&folder_key=${folder_key}&page=${page}`,
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
  // eslint-disable-next-line
  }, [page]);

  const handleChangePage = (page_num) => {
    setPage(page_num);
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
      <SRLWrapper>
        <Row className="rowgap-vbox" gutter={[12, 0]}>
          {listImage &&
            listImage.map((item) => (
              <Col
                key={uuidv4()}
                xs={24}
                sm={24}
                md={12}
                lg={6}
                xl={6}
                className="mb-24"
              >
                <Card bordered={false} className="criclebox photoBox">
                  <div className="number">
                    <Row align="middle" gutter={[24, 0]}>
                      <Col xs={24}>
                        <img
                          src={item.url ? item.url : ExamplePhoto}
                          style={{ width: "100%", height: "auto" }}
                          alt="this is thumbs"
                        />
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>
            ))}
        </Row>
      </SRLWrapper>
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
    </div>
  );
};

export default PhotoDetail;
