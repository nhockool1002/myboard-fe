import React, { useState } from "react";
import { Row, Col, Upload, Button, message, Empty, Input } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ExamplePhoto from "assets/images/example.png";
import ClickPlay from "assets/images/clickPlay.png";
import { Image } from "react-image-and-background-image-fade";

const payLoadData = [
  {
    id: 45,
    url: "https://nhutnew2dev.s3.ap-southeast-1.amazonaws.com/s3%2F5945c0ad-5194-4043-8cf3-dbcf65cb21ef-taikieuchuyennganh.png",
    file_type: "image",
  },
  {
    id: 46,
    url: "https://nhutnew2dev.s3.ap-southeast-1.amazonaws.com/s3%2F9dd96d9c-032d-4e1e-9855-debe5307b898-mov_bbb.mp4",
    file_type: "video",
  },
  {
    id: 47,
    url: "https://nhutnew2dev.s3.ap-southeast-1.amazonaws.com/s3%2F16a8d8d3-d364-4a04-9e77-ad6d123332f6-12565384_1006793216048285_4581903901498532134_n_32177370305_o.jpg",
    file_type: "image",
  },
  {
    id: 48,
    url: "https://nhutnew2dev.s3.ap-southeast-1.amazonaws.com/s3%2F590fdd76-4572-4dcb-b065-67af2be79b3a-20190715_113052.jpg",
    file_type: "image",
  },
  {
    id: 49,
    url: "https://nhutnew2dev.s3.ap-southeast-1.amazonaws.com/s3%2Faaa9b438-c599-4709-9700-969148b1fbd8-thumb_418adf7a-d8dd-47c1-a9a9-822bc931bfc3-rx1.png",
    file_type: "image",
  },
  {
    id: 51,
    url: "https://nhutnew2dev.s3.ap-southeast-1.amazonaws.com/s3%2Fb87cb675-63a1-4b27-a3a3-dea0cb2a9254-FHD0021.MOV",
    file_type: "video",
  },
];

const MediaLibrary = () => {
  const [currentData, setCurrentData] = useState({});

  const handleChooseItem = (item) => {
    setCurrentData(item);
    console.log(item);
  };

  const handleCopy = () => {
    if (currentData && currentData.file_type === "image") {
      navigator.clipboard.writeText(`<img src="${currentData.url}" />`);
    } else {
      navigator.clipboard.writeText(
        `<video controls><source key="${currentData.id}" src="${currentData.url}" type="video/mp4" /> Your browser does not support the video tag.</video>`
      );
    }
  };

  const formProps = {
    name: "file",
    action: "",
    headers: {
      Authorization: "Token 213",
    },
    multiple: true,
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
        // setUpdate(uuidv4());
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    accept: ".jpg,.jpeg,.png,.mp4,.mov",
  };

  return (
    <div>
      <Row gutter={[8, 8]} key="uploadMediaCompomentRow">
        <Col xs={24} sm={24} md={24} lg={24} key="uploadMediaCompoment">
          <div className="uploadMediaCompoment">
            <Upload {...formProps} className="upload-list-inline">
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </div>
        </Col>
      </Row>
      <Row gutter={[8, 8]} key="libraryMediaComponentRow">
        <Col xs={24} sm={24} md={18} lg={18} key="libraryMediaComponent">
          <div className="libraryMediaComponent">
            {payLoadData && payLoadData.length ? (
              payLoadData.map((item) =>
                item.file_type === "image" ? (
                  <Image
                    key={item.id}
                    src={item.url ? item.url : ExamplePhoto}
                    alt={item.url ? item.url : ExamplePhoto}
                    title="Neon cat"
                    onClick={() => handleChooseItem(item)}
                    lazyLoad
                  />
                ) : (
                  <div
                    className="videoWrapper"
                    onClick={() => handleChooseItem(item)}
                  >
                    <video controls={false} preload="none" poster={ClickPlay}>
                      <source key={item.id} src={item.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )
              )
            ) : (
              <Empty key="emptyData" />
            )}
          </div>
        </Col>
        <Col xs={24} sm={24} md={6} lg={6}>
          <div className="currentMediaComponent">
            {currentData && Object.keys(currentData).length ? (
              currentData.file_type === "image" ? (
                <div className="currentImage">
                  <img src={currentData.url ? currentData.url : ExamplePhoto} alt="this is current" />
                  <Input.Group
                    compact
                    style={{ width: "100%" }}
                    className="mediaCompact  "
                  >
                    <Input
                      style={{ width: "calc(100% - 200px)" }}
                      defaultValue={`<img src="${currentData.url}" />`}
                      value={`<img src="${currentData.url}" />`}
                      disabled
                    />
                    <Button type="primary" onClick={handleCopy}>
                      Copy
                    </Button>
                  </Input.Group>
                </div>
              ) : (
                <div className="currentVideo">
                  <video controls>
                    <source
                      key={currentData.id}
                      src={currentData.url}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                  <Input.Group
                    compact
                    style={{ width: "100%" }}
                    className="mediaCompact  "
                  >
                    <Input
                      style={{ width: "calc(100% - 200px)" }}
                      defaultValue={`<video controls><source key="${currentData.id}" src="${currentData.url}" type="video/mp4" /> Your browser does not support the video tag.</video>`}
                      value={`<video controls><source key="${currentData.id}" src="${currentData.url}" type="video/mp4" /> Your browser does not support the video tag.</video>`}
                      disabled
                    />
                    <Button type="primary" onClick={handleCopy}>
                      Copy
                    </Button>
                  </Input.Group>
                </div>
              )
            ) : (
              <Empty
                key="emptyCurrent"
                description={<span>No Data Selection</span>}
              />
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default MediaLibrary;
