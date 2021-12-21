import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Card, Col, Row, Modal, Button, Input } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import { NOTE_API, SELF_URL } from "helpers/url";
import {
  getUser,
  getToken,
  ReactQuillToolbar,
  ShowSweetAlert,
} from "utils/common";
import Loader from "react-loader-spinner";
import ReactHtmlParser from "react-html-parser";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { v4 as uuidv4 } from "uuid";
import SweetAlert from "react-bootstrap-sweetalert";
import { isEmpty } from "lodash";

const Notes = (props) => {
  const history = useHistory();
  const [listNotes, setListNotes] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleAdd, setIsModalVisibleAdd] = useState(false);
  const [currentNotes, setCurrentNotes] = useState(0);
  const [newContent, setNewContent] = useState("");
  const reactQuillSetting = ReactQuillToolbar();
  const [loading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [update, setUpdate] = useState("");
  const [newNoteKey, setNewNoteKey] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const showModal = (item) => {
    setCurrentNotes(item);
    setNewContent(item.note_content);
    setIsModalVisible(true);
  };

  const showModalAdd = () => {
    setNewNoteKey("");
    setNewNoteContent("");
    setIsModalVisibleAdd(true);
  };

  const handleOk = () => {
    if (currentUser) {
      axios
        .post(
          NOTE_API.UPDATE_NOTES,
          { note_key: currentNotes.note_key, note_content: newContent },
          {
            headers: { Authorization: "Token " + getToken() },
          }
        )
        .then((res) => {
          setUpdate(uuidv4());
          setIsLoading(false);
          setAlert(
            <ShowSweetAlert
              type="success"
              title="Success"
              message="Update NOTE SUCCESS"
              onClick={handleClickAlert}
            ></ShowSweetAlert>
          );
        })
        .catch((error) => {
          setIsLoading(false);
          setAlert(
            <ShowSweetAlert
              type="danger"
              title="Error"
              message={error.response.data.message}
              onClick={handleClickAlert}
            ></ShowSweetAlert>
          );
        });
      setIsModalVisible(false);
    }
  };

  const handleOkAdd = () => {
    if (isEmpty(newNoteKey) || newNoteKey === "") {
      setErrorMessage("NOTE_KEY_NOT_EMPTY");
    } else if (isEmpty(newNoteContent) || newNoteContent === "") {
      setErrorMessage("NOTE_CONTENT_NOT_EMPTY");
    } else {
      if (currentUser) {
        setIsLoading(true);
        axios
          .post(
            NOTE_API.CREATE_NOTES,
            { note_key: newNoteKey, note_content: newNoteContent },
            {
              headers: { Authorization: "Token " + getToken() },
            }
          )
          .then((res) => {
            setUpdate(uuidv4());
            setIsLoading(false);
            setAlert(
              <ShowSweetAlert
                type="success"
                title="Success"
                message="ADD NOTE SUCCESS"
                onClick={handleClickAlert}
              ></ShowSweetAlert>
            );
          })
          .catch((error) => {
            setIsLoading(false);
            setAlert(
              <ShowSweetAlert
                type="danger"
                title="Error"
                message={error.response.data.message}
                onClick={handleClickAlert}
              ></ShowSweetAlert>
            );
          });
        setIsModalVisibleAdd(false);
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCancelAdd = () => {
    setNewNoteKey("");
    setNewNoteContent("");
    setIsModalVisibleAdd(false);
  };

  const handleClickAlert = () => {
    setAlert(null);
    setIsLoading(false);
  };

  const handleConfirmDeleteNote = (item) => {
    const message = `Are you sure delete ${item.note_key} Note ?`;
    setAlert(
      <SweetAlert
        warning
        showCancel
        confirmBtnText="Yes, delete it!"
        confirmBtnBsStyle="danger"
        title={message}
        onConfirm={() => handleRemove(item.note_key)}
        onCancel={() => setAlert(null)}
        focusCancelBtn
        closeOnClickOutside={false}
      >
        This note will be permanently deleted !
      </SweetAlert>
    );
  };

  const handleRemove = (item) => {
    if (currentUser) {
      setIsLoading(true);
    axios
      .delete(NOTE_API.DELETE_NOTES + `?note_key=${item}`, {
        headers: { Authorization: "Token " + getToken() },
      })
      .then((res) => {
        setUpdate(uuidv4());
        setIsLoading(false);
        setAlert(
          <ShowSweetAlert
            type="success"
            title="Success"
            message="DELETE NOTE SUCCESS"
            onClick={handleClickAlert}
          ></ShowSweetAlert>
        );
      })
      .catch((error) => {
        setIsLoading(false);
        setAlert(
          <ShowSweetAlert
            type="danger"
            title="Error"
            message={error.response.data.message}
            onClick={handleClickAlert}
          ></ShowSweetAlert>
        );
      });setIsLoading(true);
    axios
      .delete(NOTE_API.DELETE_NOTES + `?note_key=${item}`, {
        headers: { Authorization: "Token " + getToken() },
      })
      .then((res) => {
        setUpdate(uuidv4());
        setIsLoading(false);
        setAlert(
          <ShowSweetAlert
            type="success"
            title="Success"
            message="DELETE NOTE SUCCESS"
            onClick={handleClickAlert}
          ></ShowSweetAlert>
        );
      })
      .catch((error) => {
        setIsLoading(false);
        setAlert(
          <ShowSweetAlert
            type="danger"
            title="Error"
            message={error.response.data.message}
            onClick={handleClickAlert}
          ></ShowSweetAlert>
        );
      });
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const user = getUser();
    if (user) {
      setCurrentUser(user);
      axios
        .get(NOTE_API.GET_NOTES, {
          headers: { Authorization: "Token " + getToken() },
        })
        .then((res) => {
          setListNotes(res.data.data);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          setAlert(
            <ShowSweetAlert
              type="danger"
              title="Error"
              message={error.response.data.message}
              onClick={handleClickAlert}
            ></ShowSweetAlert>
          );
        });
    } else history.push(SELF_URL.LOGIN);
  // eslint-disable-next-line
  }, [update]);

  return (
    <div>
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
        title={currentNotes ? currentNotes.note_key : ""}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width="50%"
        bodyStyle={{ height: 320, maxHeight: 550 }}
      >
        <ReactQuill
          theme="snow"
          value={newContent}
          onChange={setNewContent}
          modules={reactQuillSetting.modules}
          formats={reactQuillSetting.formats}
          className="reactBoxSetting"
          style={{ height: 200, marginBottom: "80px" }}
        />
      </Modal>
      <Modal
        title="Add new note"
        visible={isModalVisibleAdd}
        onOk={handleOkAdd}
        onCancel={handleCancelAdd}
        width="50%"
        bodyStyle={{ height: 350, maxHeight: 550 }}
      >
        <Input
          placeholder="Note Key"
          onChange={(e) => setNewNoteKey(e.target.value)}
          value={newNoteKey}
          style={{ borderRadius: 0 }}
        />
        <br />
        <br />
        <ReactQuill
          theme="snow"
          value={newNoteContent ? newNoteContent : ""}
          onChange={setNewNoteContent}
          modules={reactQuillSetting.modules}
          formats={reactQuillSetting.formats}
          className="reactBoxSetting"
          style={{ height: 200, marginBottom: "80px" }}
        />
        {errorMessage && (
          <div style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</div>
        )}
      </Modal>
      <Row>
        <Col span={24}>
          <Button
            type="danger"
            icon={<FileAddOutlined />}
            className="ant-btn-sm ant-btn-setting"
            onClick={() => showModalAdd()}
          >
            Add Note
          </Button>
        </Col>
      </Row>
      <Row>
        {listNotes &&
          listNotes.map((item) => (
            <Col span={8}>
              <Card
                bodyStyle={{ height: 100, maxHeight: 150, overflow: "auto" }}
                size="small"
                title={item.note_key}
                style={{ width: "90%" }}
                extra={
                  <Button
                    type="danger"
                    icon={<DeleteOutlined />}
                    onClick={() => handleConfirmDeleteNote(item)}
                  >
                    Remove
                  </Button>
                }
                actions={[
                  <EditOutlined key="edit" onClick={() => showModal(item)} />,
                ]}
              >
                {ReactHtmlParser(item.note_content)}
              </Card>
            </Col>
          ))}
      </Row>
    </div>
  );
};

export default Notes;
