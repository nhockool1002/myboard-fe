import React, { useState } from "react";
import {
  Row,
  Col,
  Tabs,
  Card,
  Modal,
  Input,
  DatePicker,
  Select,
  Button,
} from "antd";
import ReactQuill from "react-quill";
import { ReactQuillToolbar } from "utils/common";
import { SETTING_API } from "helpers/url";
import { MESSAGE } from "helpers/message";
import { capitalizeFirstLetter } from "utils/common";
import moment from "moment";
import MediaLibrary from "pages/Child/MediaLibrary";

const ProjectManagement = (props) => {
  const { TabPane } = Tabs;
  const { TextArea } = Input;
  const { Option } = Select;
  const reactQuillSetting = ReactQuillToolbar();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectType, setNewProjectType] = useState("personal");
  const [newProjectTech, setNewProjectTech] = useState("");
  const [newProjectDes, setNewProjectDes] = useState("");
  const [newProjectCustomer, setNewProjectCustomer] = useState("");
  const [newProjectStartDate, setNewProjectStartDate] = useState("");
  const [newProjectEndDate, setNewProjectEndDate] = useState("");
  const [errorProjectName, setErrorProjectName] = useState("");
  const [errorProjectType, setErrorProjectType] = useState("");
  const [errorProjectCustomer, setErrorProjectCustomer] = useState("");
  const [errorProjectDate, setErrorProjectDate] = useState("");
  const [errorProjectDes, setErrorProjectDes] = useState("");
  const [errorProjectTech, setErrorProjectTech] = useState("");
  const [isMediaLibrary, setIsMediaLibrary] = useState(false);

  const itemProject = ["personal", "outsource", "company"];

  const callback = (key) => {
    console.log(key);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleChangeProjectName = (value) => {
    setErrorProjectName("");
    setNewProjectName(value);
  };

  const handleChangeProjectCustomer = (value) => {
    setErrorProjectCustomer("");
    setNewProjectCustomer(value);
  };

  const handleChangeProjectTech = (value) => {
    setNewProjectTech(value);
    setErrorProjectTech("");
  };

  const handleChangeProjectDes = (value) => {
    setNewProjectDes(value);
    setErrorProjectDes("");
  };

  const handleChangeProjectStartDate = (date, dateString) => {
    console.log(date, dateString);
    setNewProjectStartDate(dateString);
    setErrorProjectDate("");
  };

  const handleChangeProjectEndDate = (date, dateString) => {
    console.log(date, dateString);
    setNewProjectEndDate(dateString);
    setErrorProjectDate("");
  };

  const handleChangeProjectType = (value) => {
    setNewProjectType(value);
  };

  const handleSubmit = () => {
    console.log("start");
    if (newProjectName == "" || newProjectName.length <= 0) {
      setErrorProjectName(MESSAGE.PROJECT_NAME_REQUIRED);
      console.log("error project name");
      return;
    }

    if (newProjectCustomer == "" || newProjectCustomer.length <= 0) {
      setErrorProjectCustomer(MESSAGE.PROJECT_CUSTOMER_REQUIRED);
      console.log("error project customer");
      return;
    }

    if (!itemProject.includes(newProjectType)) {
      setErrorProjectType(MESSAGE.PROJECT_TYPE_INVALID);
      console.log("error project invalid");
      return;
    }

    if (newProjectStartDate == "" || newProjectStartDate.length <= 0) {
      setErrorProjectDate(MESSAGE.PROJECT_START_DATE_REQUIRED);
      console.log("error project start date");
      return;
    } else {
      if (newProjectEndDate.length >= 0) {
        const startTime = moment(newProjectStartDate, "YYYY-MM-DD");
        const endTime = moment(newProjectEndDate, "YYYY-MM-DD");
        if (endTime.isBefore(startTime) || endTime.isSame(startTime)) {
          setErrorProjectDate(MESSAGE.PROJECT_END_DATE_INVALID);
          return;
        }
      }
    }

    if (newProjectDes == "" || newProjectDes.length <= 0) {
      setErrorProjectDes(MESSAGE.PROJECT_DESCRIPTION_REQUIRED);
      console.log("error project description");
      return;
    }

    if (newProjectTech == "" || newProjectTech.length <= 0) {
      setErrorProjectTech(MESSAGE.PROJECT_TECH_REQUIRED);
      console.log("error project tech");
      return;
    }
  };

  const handleTurnOnMedia = () => {
    setIsMediaLibrary(true);
  };

  const handleTurnOffMedia = () => {
    setIsMediaLibrary(false);
  };

  return (
    <div>
      <Modal
        title="Media Library"
        visible={isMediaLibrary}
        onCancel={handleTurnOffMedia}
        onOk={handleTurnOffMedia}
        width={1200}
        key="medialibrary"
      >
        <MediaLibrary />
      </Modal>
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        key="baisc"
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
      <Row>
        <Col lg={12} xs={24} md={12} sm={24}>
          <Tabs defaultActiveKey="1" onChange={callback} className="tabProject">
            <TabPane tab="Personal Project" key="1">
              <Row gutter={[8, 8]}>
                <Col lg={8} xs={24} md={12} sm={24}>
                  <Card
                    hoverable
                    style={{
                      width: "100%",
                      marginBottom: "10px",
                      padding: "10px",
                    }}
                    className="cardProject"
                    id="cardProject"
                    onClick={showModal}
                  >
                    <div>
                      <h5>iOSTaiyou太陽工業</h5>
                      <h6>06/2022 - Present</h6>
                      <h5 className="cuscomclass">
                        Blind students team - Nguyen Huu Toan
                      </h5>
                    </div>
                  </Card>
                </Col>
                <Col lg={8} xs={24} md={12} sm={24}>
                  <Card
                    hoverable
                    style={{
                      width: "100%",
                      marginBottom: "10px",
                      padding: "10px",
                    }}
                    className="cardProject"
                    id="cardProject"
                    onClick={showModal}
                  >
                    <div>
                      <h5>iOSTaiyou太陽工業</h5>
                      <h6>06/2022 - Present</h6>
                      <h5 className="cuscomclass">Pascaliaasia VietNam</h5>
                    </div>
                  </Card>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Outsource Project" key="2">
              Content of Tab Pane 2
            </TabPane>
            <TabPane tab="Company Project" key="3">
              Content of Tab Pane 3
            </TabPane>
          </Tabs>
        </Col>
        <Col lg={12} xs={24} md={12} sm={24}>
          <Row gutter={[8, 8]}>
            <Col lg={24} xs={24} md={24} sm={24}>
              <div className="site-card-border-less-wrapper boxProjectAdd">
                <Card
                  title="ADD PROJECT"
                  style={{ width: "100%" }}
                  bordered={false}
                >
                  <div className="projectNameDiv">
                    <h6 className="projectLabel">Project Name</h6>
                    <Input
                      placeholder="Project Name"
                      value={newProjectName}
                      onChange={(e) => handleChangeProjectName(e.target.value)}
                    />
                    {errorProjectName && errorProjectName.length && (
                      <h6 className="projectError">{errorProjectName}</h6>
                    )}
                  </div>
                  <br />
                  <div className="projectTypeDiv">
                    <h6 className="projectLabel">Project Type</h6>
                    <Select
                      defaultValue={newProjectType}
                      style={{ width: "100%" }}
                      onChange={handleChangeProjectType}
                    >
                      {itemProject &&
                        itemProject.map((item) => (
                          <Option value={item}>
                            {capitalizeFirstLetter(item)}
                          </Option>
                        ))}
                    </Select>
                  </div>
                  <br />
                  <div className="projectCustomerDiv">
                    <h6 className="projectLabel">Project Customer</h6>
                    <Input
                      placeholder="Mitani"
                      value={newProjectCustomer}
                      onChange={(e) =>
                        handleChangeProjectCustomer(e.target.value)
                      }
                    />
                    {errorProjectCustomer && errorProjectCustomer.length && (
                      <h6 className="projectError">{errorProjectCustomer}</h6>
                    )}
                  </div>
                  <br />
                  <div className="projectDateDiv">
                    <Row gutter={[8, 8]}>
                      <Col lg={12} xs={24} md={12} sm={24}>
                        <h6 className="projectLabel">Start Date</h6>
                        <DatePicker
                          onChange={handleChangeProjectStartDate}
                          style={{ width: "100%" }}
                        />
                      </Col>
                      <Col lg={12} xs={24} md={12} sm={24}>
                        <h6 className="projectLabel">End Date</h6>
                        <DatePicker
                          onChange={handleChangeProjectEndDate}
                          style={{ width: "100%" }}
                        />
                      </Col>
                      {errorProjectDate && errorProjectDate.length && (
                        <h6 className="projectError">{errorProjectDate}</h6>
                      )}
                    </Row>
                  </div>
                  <br />
                  <div className="projectDesDiv">
                    <h6 className="projectLabel">Project Description</h6>
                    <Button
                      type="primary"
                      style={{ width: "20%" }}
                      onClick={handleTurnOnMedia}
                    >
                      Media
                    </Button>
                    <br />
                    <br />
                    <ReactQuill
                      theme="snow"
                      value={newProjectDes}
                      onChange={(e) => handleChangeProjectDes(e)}
                      modules={reactQuillSetting.modules}
                      formats={reactQuillSetting.formats}
                      className="reactBoxSetting boxNoteReactQuill"
                    />
                    {errorProjectDes && errorProjectDes.length && (
                      <h6 className="projectError">{errorProjectDes}</h6>
                    )}
                  </div>
                  <div className="projectTechDiv">
                    <h6 className="projectLabel">Project Technology</h6>
                    <TextArea
                      rows={3}
                      value={newProjectTech}
                      onChange={(e) => handleChangeProjectTech(e.target.value)}
                      placeholder="- C++/C#"
                    />
                    {errorProjectTech && errorProjectTech.length && (
                      <h6 className="projectError">{errorProjectTech}</h6>
                    )}
                  </div>
                  <br />
                  <Button
                    type="primary"
                    style={{ width: "100%" }}
                    onClick={handleSubmit}
                  >
                    Add Project
                  </Button>
                </Card>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default ProjectManagement;
