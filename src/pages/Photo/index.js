import React from "react";
import { Card, Col, Row, Typography } from "antd";
import ExamplePhoto from "assets/images/example.png";

const Photo = (props) => {
  const { Title } = Typography;
  return (
    <div className="layout-content">
      <Row className="rowgap-vbox" gutter={[12, 0]}>
        <Col key={1} xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
          <Card bordered={false} className="criclebox ">
            <div className="number">
              <Row align="middle" gutter={[24, 0]}>
                <Col xs={24}>
                  <img
                    src={ExamplePhoto}
                    style={{ width: "100%", height: "auto" }}
                    alt="this is thumb"
                  />
                  <Title level={3}>6666</Title>
                  <div className="bnb2">2222</div>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Photo;
