import React, { useState, useEffect } from "react"
import {
  Card,
  Col,
  Row,
  Button,
  Select,
  Upload,
  message,
  Typography,
  Pagination
} from "antd"
import {
  UploadOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from "@ant-design/icons"
import { getUser, getToken } from "utils/common"
import { S3_API, SELF_URL } from "helpers/url"
import { useHistory } from "react-router-dom"
import Loader from "react-loader-spinner"
import SweetAlert from "react-bootstrap-sweetalert"
import axios from "axios"
import { ShowSweetAlert } from "utils/common"
import { SRLWrapper } from "simple-react-lightbox"
import { v4 as uuidv4 } from "uuid"
import DeleteIcon from "assets/images/delete.png"

const UploadPictures = (props) => {
  const { Text } = Typography
  const history = useHistory()
  const [loading, setIsLoading] = useState(false)
  const [alert, setAlert] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [currentBucketName, setCurrentBucketName] = useState("")
  const [currentFolder, setCurrentFolder] = useState(0)
  const [listAllBucket, setListAllBucket] = useState([])
  const { Option } = Select
  const [disableFolder, setDisableFolder] = useState(true)
  const [disableBucket, setDisableBucket] = useState(true)
  const [disableApplyButton, setDisableApplyButton] = useState(true)
  const [listFolderOfBucket, setListFolderOfBucket] = useState([])
  const [listImage, setListImage] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [pagination, setPagination] = useState(false)
  const [rowPerPage, setRowPerPage] = useState(0)
  const [selectedFolder, setSelectedFolder] = useState()
  const [listFileName, setListFileName] = useState([])
  const [listFile, setListFile] = useState([])
  const [isDisable, setIsDisable] = useState(true)
  
  var countFile = 0;

  useEffect(() => {
    const user = getUser()
    setCurrentUser(user)
    if (user !== null) {
      setCurrentUser(user)
      axios
        .get(S3_API.GET_ALL_S3_BUCKET, {
          headers: { Authorization: "Token " + getToken() }
        })
        .then((res) => {
          setDisableBucket(false)
          setListAllBucket(res.data.data)
        })
        .catch((error) =>
          setAlert(
            <ShowSweetAlert
              type="danger"
              title="Error"
              message={error.response}
              onClick={handleClickAlert}
            ></ShowSweetAlert>
          )
        )
    } else window.location.href = SELF_URL.LOGIN
  }, [])

  function changeListFile(files) {
    var list = []
    ;[...files].map((item) => {
      const newItem = {
        id: uuidv4(),
        name: item.name,
        status: "false"
      }
      list.push(newItem)
    })
    setListFile([...files])
    setListFileName(list)
  }

  const handleFindImage = (currentPage) => {
    setIsLoading(true)
    const user = getUser()
    if (user !== null) {
      axios
        .get(
          S3_API.GET_IMAGE_BY_FOLDER +
            `?bucket_name=${currentBucketName}&folder_key=${currentFolder}&page=${currentPage}`,
          {
            headers: { Authorization: "Token " + getToken() }
          }
        )
        .then((res) => {
          setIsLoading(false)
          setListImage(res.data.data)
          setTotal(res.data.total)
          setPagination(true)
          setRowPerPage(res.data.row_per_page)
        })
        .catch((error) =>
          setAlert(
            <ShowSweetAlert
              type="danger"
              title="Error"
              message={error.response?.data?.message}
              onClick={handleClickAlert}
            ></ShowSweetAlert>
          )
        )
    } else history.push(SELF_URL.LOGIN)
  }

  const handleClickAlert = () => {
    setAlert(null)
    setIsLoading(false)
  }

  const handleConfirmDelete = (id) => {
    setAlert(
      <SweetAlert
        warning
        showCancel
        confirmBtnText="Yes, delete it!"
        confirmBtnBsStyle="danger"
        title="Are you sure?"
        onConfirm={() => comfirmedDeleteFile(id)}
        onCancel={() => setAlert(null)}
        focusCancelBtn
      >
        You will not be able to recover this imaginary file!
      </SweetAlert>
    )
  }

  const comfirmedDeleteFile = (id) => {
    setAlert(null)
    setIsLoading(true)
    if (currentUser !== null) {
      axios
        .delete(S3_API.DELETE_FILE_BY_ID + `?file_id=${id}`, {
          headers: { Authorization: "Token " + getToken() }
        })
        .then((res) => {
          setIsLoading(false)
          handleFindImage(page)
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
        )
    } else window.location.href = SELF_URL.LOGIN
  }

  const handleChangePage = (page_num) => {
    setPage(page_num)
    handleFindImage(page_num)
  }

  function handleChangeFolder(value) {
    setDisableApplyButton(false)
    setSelectedFolder(value)
    setCurrentFolder(value)
  }
  function handleChange(value) {
    setSelectedFolder(null)
    const user = getUser()
    if (user !== null) {
      setCurrentUser(user)
      axios
        .get(S3_API.GET_FOLDER_BY_BUCKET_ID + `?bucket_id=${value}`, {
          headers: { Authorization: "Token " + getToken() }
        })
        .then((res) => {
          setDisableApplyButton(true)
          setDisableFolder(false)
          setListFolderOfBucket(res.data.data)
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
        )
    } else history.push(SELF_URL.LOGIN)
    if (listAllBucket) {
      const currentBucketFind = listAllBucket.find((item) => {
        return item.id === value
      })
      setCurrentBucketName(currentBucketFind.bucket_name)
    }
  }

  const formProps = {
    name: "files",
    action: S3_API.UPLOAD_IMAGES,
    headers: {
      Authorization: "Token " + getToken()
    },
    data: {
      bucket_name: currentBucketName,
      folder_key: currentFolder
    },
    listType: "picture",
    multiple: true,
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`)
        handleFindImage(page)
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`)
        console.log(info.file, info)
      }
    },
    accept: ".jpg,.jpeg,.png,.mp4,.mov",
    progress: {
      width: "90%",
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068"
      },
      strokeWidth: 2,
      format: (percent) => `${parseFloat(percent.toFixed(2))}%`
    }
  }

  function renderStatus(status) {
    console.log(status)
    if (status === "false") {
      return <CloseCircleOutlined style={{ color: "red" }} />
    }
    if (status === "true") {
      return <CheckCircleOutlined style={{ color: "green" }} />
    }
    if (status === "uploading") {
      return <ClockCircleOutlined style={{ color: "orange" }} />
    }
  }

  async function handleUploadEachFile() {
    console.log(`countFile: ${countFile}, listFileName.length: ${listFileName.length}`)
    if (countFile < listFileName.length) {
      const formData = new FormData()
      formData.append("bucket_name", currentBucketName)
      formData.append("folder_key", currentFolder)
      formData.append("id", listFileName[countFile].id)
      formData.append("file", listFile[countFile])
      setListFileName((prevState) =>
        prevState.map((item) =>
          item.id === listFileName[countFile].id
            ? { ...item, status: "uploading" }
            : item
        )
      )
      axios
        .post(S3_API.UPLOAD_IMAGE_DATA, formData, {
          headers: { Authorization: "Token " + getToken() }
        })
        .then((res) => {
          setListFileName((prevState) =>
            prevState.map((item) =>
              item.id === res.data.id
                ? { ...item, status: "true" }
                : item
            )
          )
          countFile++;
          handleUploadEachFile();
        })
        .catch((error) =>
          console.log(`[item ${listFileName[countFile].id} - Failed - ${error.response}`)
        )
    } else {
      countFile = 0;
    }
    // ;(await listFileName) &&
    //   listFileName.length > 0 &&
    //   listFileName.map((item, index) => {
    //     const formData = new FormData()
    //     formData.append("bucket_name", currentBucketName)
    //     formData.append("folder_key", currentFolder)
    //     formData.append("id", item.id)
    //     formData.append("file", listFile[index])
    //     const updateState = listFileName.map((itemData) => {
    //       if (itemData.id === item.id) {
    //         return { ...item, status: "uploading" }
    //       }
    //       return item
    //     })
    //     setListFileName(updateState)
    //     axios
    //       .post(S3_API.UPLOAD_IMAGE_DATA, formData, {
    //         headers: { Authorization: "Token " + getToken() }
    //       })
    //       .then((res) => {
    //         const doneUpload = listFileName.map((itemData) => {
    //           if (itemData.id === res.data.id) {
    //             return { ...item, status: "true" }
    //           }
    //           return item
    //         })
    //         setListFileName(doneUpload)
    //       })
    //       .catch((error) =>
    //         console.log(`[item ${item.id} - Failed - ${error.response}`)
    //       )
    //   })
  }

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
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
          <Card bordered={false} className="criclebox h-full">
            <Row>
              <Col span={8}>
                <Text>Bucket Name: </Text>
                <Select
                  style={{ width: "90%" }}
                  onChange={handleChange}
                  disabled={disableBucket}
                >
                  {listAllBucket &&
                    listAllBucket.map((item) => (
                      <Option value={item.id}>{item.bucket_name}</Option>
                    ))}
                </Select>
              </Col>
              <Col span={10}>
                <Text>Folder: </Text>
                <Select
                  style={{ width: "90%" }}
                  disabled={disableFolder}
                  onChange={handleChangeFolder}
                  value={selectedFolder}
                >
                  {listFolderOfBucket &&
                    listFolderOfBucket.map((item) => (
                      <Option value={item.folder_key}>
                        Name: [{item.folder_name}] - Key: [{item.folder_key}]
                      </Option>
                    ))}
                </Select>
              </Col>
              <Col span={6}>
                <Button
                  type="danger"
                  className="ant-btn-sm ant-btn-block applyFindImage"
                  onClick={() => {
                    setPage(1)
                    handleFindImage(1)
                    setIsDisable(false)
                  }}
                  disabled={disableApplyButton ? true : false}
                >
                  Apply
                </Button>
              </Col>
            </Row>
            <Row className="listImageStyle">
              {listImage &&
                listImage.map((item) => (
                  <Col span={6} style={{ padding: 10 }}>
                    <div className="imageWrapper">
                      <div
                        className="deleteButton"
                        onClick={(e) => handleConfirmDelete(item.id)}
                      >
                        <img
                          src={DeleteIcon}
                          srl_gallery_image="true"
                          alt="delete thumb button"
                        />
                      </div>
                      <SRLWrapper>
                        {item.file_type === "video" ? (
                          <video
                            style={{ width: "100%" }}
                            className="imageItem"
                          >
                            <source src={item.url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <a href={item.url}>
                            <img
                              src={item.url}
                              style={{ width: "100%" }}
                              className="imageItem"
                              alt="item data thumb"
                            />
                          </a>
                        )}
                      </SRLWrapper>
                    </div>
                  </Col>
                ))}
            </Row>
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
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
          <Card bordered={false} className="criclebox h-auto">
            <input
              type="file"
              id="files"
              name="files"
              multiple
              onChange={(e) => changeListFile(e.target.files)}
              disabled={isDisable ? true : false}
            />
            <div className='listFileBox'>
            {listFileName &&
              listFileName.length > 0 &&
              listFileName.map((item) => (
                <div className="listFile" alt={item.id}>
                  <span>{item.name}</span>
                  <span>{renderStatus(item.status)}</span>
                </div>
              ))}
            </div>
            <br />
            <br />
            <Button
              onClick={handleUploadEachFile}
              disabled={isDisable ? true : false}
            >
              UPLOAD
            </Button>
            {/* <Upload {...formProps} className="upload-list-inline">
              <Button icon={<UploadOutlined />} disabled={disableApplyButton}>
                Click to Upload
              </Button>
            </Upload> */}
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default UploadPictures
