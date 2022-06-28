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
import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Tables from "./pages/Tables";
import Billing from "./pages/Billing";
import Rtl from "./pages/Rtl";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Main from "./components/layout/Main";
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import Photo from "pages/Photo";

import PrivateRoute from "utils/privateRoute";
// import PublicRoute from "utils/publicRoute";
import PhotoSettings from "pages/PhotoSettings";
import BucketSettings from "pages/BucketSettings";
import FolderSetting from "pages/FolderSettings";
import UploadPictures from "pages/UploadPictures";
import PhotoDetail from "pages/PhotoDetail";
import Settings from "pages/Settings";
import Notes from "pages/Notes";
import MoneyExchange from "pages/MoneyExchange";
import Categories from "pages/Categories";
import Labels from "pages/Labels";
import ProjectManagement from "pages/ProjectManagement";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
// import { getUser, getToken } from "utils/common";
import { SETTING_API } from "helpers/url";
import { ShowSweetAlert } from "utils/common";
import axios from "axios";
import { Helmet } from "react-helmet";
import { SELF_URL } from 'helpers/url';
import PaymentReminder from "pages/PaymentReminder";
import UtestOverview from 'pages/Utest'

function App() {
  const [listSetting, setListSetting] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleClickAlert = () => {
    setAlert(null);
    setIsLoading(false);
  };

  const getData = (data, itemFind) => {
    if (data) {
      return data.find((item) => {
        return item.setting_key === itemFind;
      })?.setting_value;
    }
  };

  useEffect(() => {
    setIsLoading(true);
    axios
        .get(SETTING_API.GET_GENERAL_SETTINGS)
        .then((res) => {
          setIsLoading(false);
          setListSetting({
            title: getData(res.data.data, "title"),
            description: getData(res.data.data, "description"),
            image: getData(res.data.data, "thumb_image"),
            fav: getData(res.data.data, "fav_image"),
          });
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
  // eslint-disable-next-line
  }, []);

  return (
    <div className="App">
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
      <Helmet>
        <meta charSet="utf-8" />
        <title>{listSetting ? listSetting.title : ""}</title>
        <link rel="canonical" href={window.location.href} />
        <link rel="icon" type="image/png" href={listSetting ? listSetting.fav : ""} />
        <meta name="description" content={listSetting ? listSetting.description : ""} />
        <meta property="og:locale" content="vi_VN" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={listSetting ? listSetting.title : ""} />
        <meta property="og:description" content={listSetting ? listSetting.description : ""} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:site_name" content={listSetting ? listSetting.title : ""} />
        <meta property="og:image" content={listSetting ? listSetting.image : ""}  />
        <meta property="og:image:secure_url" content={listSetting ? listSetting.image : ""}  />
        <meta property="og:image:width" content="297" />
        <meta property="og:image:height" content="295" />
        <meta property="og:image:type" content="image/png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={listSetting ? listSetting.title : ""} />
        <meta name="twitter:description" content={listSetting ? listSetting.description : ""} />
        <meta name="twitter:image" content={listSetting ? listSetting.image : ""}  />
      </Helmet>
      <Switch>
        <Route path="/sign-up" exact component={SignUp} />
        <Route path="/sign-in" exact component={SignIn} />
        <Main>
          <Route exact path="/" component={Home} />
          <PrivateRoute exact path="/tables" component={Tables} />
          <PrivateRoute exact path="/billing" component={Billing} />
          <PrivateRoute exact path="/rtl" component={Rtl} />
          <PrivateRoute exact path="/profile" component={Profile} />
          {/* <Redirect from="*" to="/dashboard" /> */}
          <PrivateRoute exact path={SELF_URL.PHOTO} component={Photo} />
          <PrivateRoute exact path={SELF_URL.NOTES} component={Notes} />
          <PrivateRoute exact path={SELF_URL.MONEY_EXCHANGE} component={MoneyExchange} />
          <PrivateRoute exact path={SELF_URL.CATEGORIES} component={Categories} />
          <PrivateRoute exact path={SELF_URL.LABELS} component={Labels} />
          <PrivateRoute exact path={SELF_URL.PROJECTS} component={ProjectManagement} />
          <PrivateRoute exact path={SELF_URL.PAYMENT} component={PaymentReminder} />
          <PrivateRoute exact path={SELF_URL.UTEST} component={UtestOverview} />
          <PrivateRoute
            exact
            path={SELF_URL.PHOTO_SETTINGS}
            component={PhotoSettings}
          />
          <PrivateRoute
            exact
            path={SELF_URL.BUCKET_MANAGEMENT}
            component={BucketSettings}
          />
          <PrivateRoute
            exact
            path={SELF_URL.FOLDER_MANAGEMENT}
            component={FolderSetting}
          />
          <PrivateRoute
            exact
            path={SELF_URL.UPLOAD_PICTURE}
            component={UploadPictures}
          />
          <PrivateRoute
            exact
            path="/photo-details/:folder_key/:bucket_name"
            component={PhotoDetail}
          />
          <PrivateRoute exact path={SELF_URL.GENERAL_SETTINGS} component={Settings} />
        </Main>
      </Switch>
    </div>
  );
}

export default App;
