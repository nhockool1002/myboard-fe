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
import UploadPictures from 'pages/UploadPictures';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

function App() {
  return (
    <div className="App">
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
          <PrivateRoute exact path="/photo" component={Photo} />
          <PrivateRoute exact path="/photo-settings" component={PhotoSettings} />
          <PrivateRoute exact path="/bucket-management" component={BucketSettings} />
          <PrivateRoute exact path="/folder-management" component={FolderSetting} />
          <PrivateRoute exact path="/upload-pictures" component={UploadPictures} />
        </Main>
      </Switch>
    </div>
  );
}

export default App;
