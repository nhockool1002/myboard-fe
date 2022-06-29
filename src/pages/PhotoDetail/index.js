import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Row, Modal } from "antd";
import { getUser, getToken } from "utils/common";
import { S3_API, SELF_URL } from "helpers/url";
import Loader from "react-loader-spinner";

import { ShowSweetAlert } from "utils/common";
import { useHistory } from "react-router-dom";
import ExamplePhoto from "assets/images/example.png";
import { SRLWrapper } from "simple-react-lightbox";
import Masonry from "react-masonry-component";
import { BackgroundImage } from "react-image-and-background-image-fade";
import { v4 as uuidv4 } from "uuid";

const PhotoDetail = (props) => {
  const history = useHistory();
  const params = useParams();
  const [loading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const { folder_key, bucket_name } = useParams();
  const [mansoryImage, setMansoryImage] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const [listPaginate, setListPaginate] = useState([]);


  const masonryOptions = {
    transitionDuration: 0,
  };

  const imagesLoadedOptions = { background: ".my-bg-image-el" };

  const renderPaginate = (quantity) => {
    let arr = [];
    for (var i = 1; i <= quantity; i++) {
        arr.push(i.toString())
    }
    setListPaginate(arr)
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let getPage = urlParams.get('page');

    if (getPage === null) {
      getPage = "1"
    }

    setIsLoading(true);
    const user = getUser();
    if (user !== null) {
      axios
        .get(
          S3_API.GET_IMAGE_BY_FOLDER +
            `?bucket_name=${bucket_name}&folder_key=${folder_key}&page=${getPage ? getPage : "1"}`,
          {
            headers: { Authorization: "Token " + getToken() },
          }
        )
        .then((res) => {
          setIsLoading(false);
          setMansoryImage(res.data.data);
          renderPaginate(Math.ceil(res.data.total/res.data.row_per_page))
        })
        .catch((error) =>
          {
            setAlert(
              <ShowSweetAlert
                type="danger"
                title="Error"
                message={error.response.data.message}
                onClick={handleClickAlert}
              ></ShowSweetAlert>
            )
            setIsLoading(false)
            history.push(SELF_URL.PHOTO);
          }
        );
    } else history.push(SELF_URL.LOGIN);
    // eslint-disable-next-line
  }, []);

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
        onOk={handleTurnOffModal}
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
                      className="itemInList"
                    >
                      <video
                        style={{ width: "100%", height: "100%" }}
                        controls
                      >
                        <source src={item.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                </li>
              ) : (
                <li className="image-element-class">
                  <div style={{ padding: "5px" }}>
                    <BackgroundImage
                      src={item.url ? item.url : ExamplePhoto}
                      width="420px"
                      height="300px"
                      style={{
                        width: "420px",
                        height: "300px",
                        backgroundPosition: "center center",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        borderRadius: "5px",
                      }}
                      className="itemInList"
                      onClick={() => handleOpenModal(item)}
                      lazyLoad
                    />
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
        <div className='pageListImage'>
          <ul>
          {listPaginate && listPaginate.length &&  listPaginate.map((item) => (
            <li key={uuidv4()}><a href={`${SELF_URL.PHOTO_DETAIL}/${params.folder_key}/${params.bucket_name}/?page=${item}`}>{item}</a></li>
          ))}
          </ul>
        </div>
        {/* <Col span={24}>
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
        </Col> */}
      </Row>
    </div>
  );
};

export default PhotoDetail;
