import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Col, Row, Pagination, Modal } from "antd";
import { getUser, getToken } from "utils/common";
import { S3_API, SELF_URL } from "helpers/url";
import Loader from "react-loader-spinner";

import { ShowSweetAlert } from "utils/common";
import { useHistory } from "react-router-dom";
import ExamplePhoto from "assets/images/example.png";
import { SRLWrapper } from "simple-react-lightbox";
import Masonry from "react-masonry-component";

const PhotoDetail = (props) => {
  const history = useHistory();
  const [loading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const { folder_key, bucket_name } = useParams();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState(false);
  const [rowPerPage, setRowPerPage] = useState(0);
  const [mansoryImage, setMansoryImage] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState({});

  const masonryOptions = {
    transitionDuration: 0,
  };

  const imagesLoadedOptions = { background: ".my-bg-image-el" };

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
          setTotal(res.data.total);
          setPagination(true);
          setRowPerPage(res.data.row_per_page);
          setMansoryImage(res.data.data);
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
    setIsLoading(true);
    window.scrollTo(0, 0);
    setTimeout(() => {
      setPage(page_num);
      setIsLoading(false);
    }, 2000);
  };

  const handleClickAlert = () => {
    setAlert(null);
    setIsLoading(false);
  };

  const handleOpenModal = (item) => {
    setCurrentItem(item);
    setShowModal(true);
  };

  const handleTurnOffModal = () => {
    setCurrentItem({});
    setShowModal(false);
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
      <Modal
        title="View Image"
        visible={showModal}
        className="showContentImage"
        onCancel={handleTurnOffModal}
        centered
        width={900}
      >
        <div style={{ width: "100%", textAlign: "center" }}>
          <img
            src={currentItem.url ? currentItem.url : ExamplePhoto}
            style={{ maxHeight: "80vh" }}
            alt="this is zoom window"
          />
        </div>
      </Modal>
      <SRLWrapper>
        {mansoryImage && (
          <Masonry
            className={"my-gallery-class"} // default ''
            elementType={"ul"} // default 'div'
            options={masonryOptions} // default {}
            disableImagesLoaded={false} // default false
            updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
            imagesLoadedOptions={imagesLoadedOptions} // default {}
          >
            {mansoryImage.map((item) =>
              item.file_type === "video" ? (
                <li className="image-element-class">
                  <div style={{ padding: "5px" }}>
                    <div
                      style={{
                        width: "420px",
                        height: "300px",
                        backgroundColor: "black",
                        borderRadius: "5px",
                      }}
                    >
                      <video style={{ width: "100%", height: "100%" }} controls>
                        <source src={item.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                </li>
              ) : (
                <li className="image-element-class">
                  <div style={{ padding: "5px" }}>
                    <div
                      style={{
                        width: "420px",
                        height: "300px",
                        backgroundImage: item.url
                          ? `url(${item.url})`
                          : `url(${ExamplePhoto})`,
                        backgroundPosition: "center center",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        borderRadius: "5px",
                      }}
                      onClick={() => handleOpenModal(item)}
                    ></div>
                  </div>
                  {/* <img
                    src={item.url ? item.url : ExamplePhoto}
                    style={{ width: "420px" }}
                    alt="this is thumbs"
                  /> */}
                </li>
              )
            )}
          </Masonry>
        )}
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
