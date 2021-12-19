/*!
  =========================================================
  * Muse Ant Design Dashboard - v1.0.0
  =========================================================
  * Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
  * Copyright 2021 Creative Tim (https://www.creative-tim.com)
  * Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
  * Coded by Creative Tim
  =========================================================
  * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React, { useState, useEffect } from "react";
import { Layout, Row, Col } from "antd";
import { getUser, getToken } from "utils/common";
import { SETTING_API, SELF_URL } from "helpers/url";
import { ShowSweetAlert } from "utils/common";
import ReactHtmlParser from "react-html-parser";
import Loader from "react-loader-spinner";
import axios from "axios";

function Footer() {
  const [footerSetting, setFooterSetting] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const { Footer: AntFooter } = Layout;

  const handleClickAlert = () => {
    setAlert(null);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    const user = getUser();
    if (user !== null) {
      axios
        .get(SETTING_API.GET_GENERAL_SETTINGS, {
          headers: { Authorization: "Token " + getToken() },
        })
        .then((res) => {
          setIsLoading(false);
          const data = res.data.data.find((item) => {
            return item.setting_key === "footer";
          });
          setFooterSetting(data);
        })
        .catch((error) => {
          setIsLoading(true);
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
  }, []);

  return (
    <AntFooter style={{ background: "#fafafa" }}>
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
      <Row className="just">
        <Col xs={24} md={12} lg={12}>
          <div className="copyright">
            {/* © 2021, made with
            {<HeartFilled />} by
            <a href="#pablo" className="font-weight-bold" target="_blank">
              Creative Tim
            </a>
            for a better web. */}
            {ReactHtmlParser(footerSetting ? footerSetting.setting_value : "")}
          </div>
        </Col>
        <Col xs={24} md={12} lg={12}>
          <div className="footer-menu">
            <ul>
              <li className="nav-item">
                <a
                  href="#pablo"
                  className="nav-link text-muted"
                  target="_blank"
                >
                  Creative Tim
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="#pablo"
                  className="nav-link text-muted"
                  target="_blank"
                >
                  About Us
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="#pablo"
                  className="nav-link text-muted"
                  target="_blank"
                >
                  Blog
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="#pablo"
                  className="nav-link pe-0 text-muted"
                  target="_blank"
                >
                  License
                </a>
              </li>
            </ul>
          </div>
        </Col>
      </Row>
    </AntFooter>
  );
}

export default Footer;
