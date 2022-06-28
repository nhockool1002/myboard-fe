import React, { useEffect, useState } from "react"
import { Col, Table, Row, Tabs } from "antd"
import axios from "axios"
import { UTEST_API } from "helpers/url"
import Loader from "react-loader-spinner"
import { getUser, getToken, ShowSweetAlert } from "utils/common"
import moment from "moment"
import { v4 as uuidv4 } from "uuid"
import { isEmpty } from "lodash"
import { Button } from "antd"
import {
  BugOutlined,
  CommentOutlined,
  DingdingOutlined,
  DollarCircleOutlined,
  HeatMapOutlined,
  InfoCircleOutlined,
  LockOutlined,
  MailOutlined,
  PlayCircleOutlined,
  StopOutlined
} from "@ant-design/icons"

const { TabPane } = Tabs

const UtestOverview = () => {
  const [alert, setAlert] = useState(null)
  const [loading, setIsLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState({})
  const [data, setData] = useState([])
  const [currrentPayment, setCurrentPayment] = useState(0)
  const [listPayment, setListPayment] = useState([])
  const [tabPane, setTabPane] = useState(1)
  const [profile, setProfile] = useState({})
  const [totalPayout, setTotalPayout] = useState(0)
  const [pendingPayout, setPendingPayout] = useState(0)
  const [listActivity, setListActivity] = useState([])
  const [pageActivity, setPageActivity] = useState(1)

  const changeTabsPane = (key) => {
    setTabPane(parseInt(key))
  }

  const handleClickAlert = () => {
    setAlert(null)
    setIsLoading(false)
  }

  const responseBadges = (badgesText) => {
    if (badgesText === "unrated") {
      return <span class="rating-tier-icon rating-11111"></span>
    }
    if (badgesText === "rated") {
      return <span class="rating-tier-icon rating-5"></span>
    }
    if (badgesText === "proven") {
      return <span class="rating-tier-icon rating-4"></span>
    }
    if (badgesText === "bronze") {
      return <span class="rating-tier-icon rating-3"></span>
    }
    if (badgesText === "silver") {
      return <span class="rating-tier-icon rating-2"></span>
    }
    if (badgesText === "gold") {
      return <span class="rating-tier-icon rating-1"></span>
    }
  }

  const callPreApprovePayment = () => {
    if (currentUser !== 0) {
      setIsLoading(true)
      const user = getUser()
      setCurrentUser(user)
      if (user) {
        axios
          .get(UTEST_API.GET_PRE_APPROVED, {
            headers: { Authorization: "Token " + getToken() }
          })
          .then((res) => {
            setIsLoading(false)
            setListPayment(res.data.data)
          })
          .catch((error) => {
            setIsLoading(true)
            setAlert(
              <ShowSweetAlert
                type="danger"
                title="Error"
                message={error.response}
                onClick={handleClickAlert}
              ></ShowSweetAlert>
            )
          })
      }
    }
  }

  function formatMoney(number) {
    return number.toLocaleString("en-US", {
      style: "currency",
      currency: "USD"
    })
  }

  const renderText = (row) => {
    if (row.paidEntityTypeId === 1) {
      return (
        <div className="textBugName">
          <a
            href={`https://platform.utest.com/testcycles/${row.testCycleId}/issues/${row.paidEntityId}`}
            target="_blank"
            rel="noreferrer"
          >
            {row.paidEntityDescription}
          </a>
        </div>
      )
    }
    if (row.paidEntityTypeId === 9) {
      return (
        <div className="textBugName">
          <a
            href={`https://platform.utest.com/testcycles/${row.testCycleId}/testcases/${row.paidEntityId}`}
            target="_blank"
            rel="noreferrer"
          >
            {row.paidEntityDescription}
          </a>
        </div>
      )
    }
    return <span className="textBugName">{row.paidEntityDescription}</span>
  }

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => (
        <span className="textCreateDate">
          {moment(text).format("DD/MM/YYYY")}
        </span>
      )
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text) => (
        <span className="textCompanyName">{formatMoney(parseFloat(text))}</span>
      )
    }
  ]

  const columnsPayment = [
    {
      title: "Date",
      dataIndex: "createDate",
      key: "createDate",
      width: "10%",
      render: (text) => (
        <span className="textCreateDate">
          {moment(text).format("DD/MM/YYYY")}
        </span>
      )
    },
    {
      title: "Company",
      dataIndex: "companyName",
      key: "companyName",
      width: "10%",
      render: (text) => <span className="textCompanyName">{text}</span>
    },
    {
      title: "TestCycle",
      dataIndex: "testCycleName",
      key: "testCycleName",
      width: "25%",
      render: (text, row) => (
        <div className="textTestCycleName">
          <a
            href={`https://platform.utest.com/testcycles/${row.testCycleId}/`}
            target="_blank"
            rel="noreferrer"
          >
            {text}
          </a>
        </div>
      )
    },
    {
      title: "Type",
      dataIndex: "paidEntityTypeId",
      key: "paidEntityTypeId",
      width: "10%",
      render: (text, row) => (
        <span className={`typeCondition typeCondition-${text}`}>
          {row.paidEntityTypeDescription}
        </span>
      )
    },
    {
      title: "Title/Reason",
      dataIndex: "paidEntityDescription",
      key: "paidEntityDescription",
      width: "20%",
      render: (text, row) => renderText(row)
    },
    {
      title: "Rate",
      dataIndex: "paymentAmount",
      key: "paymentAmount",
      width: "10%",
      render: (text) => (
        <span className="textRate">{formatMoney(parseFloat(text))}</span>
      )
    }
  ]

  const getNewActivity = () => {
    setPageActivity(pageActivity + 1)
  }

  const renderActivity = (row) => {
    if (row.type === "test_cycle_invite_activity") {
      return (
        <tr key={row?.item?.id + uuidv4()}>
          <td className="tdIconWrap">
            <div className="layoutIcon type-invitation">
              <MailOutlined />
            </div>
          </td>
          <td className="tdContent">
            <span className="atvType">Invitation </span>-{" "}
            <span className="atvUrl">
              <a
                href={"https://platform.utest.com/testcycles/" + row?.item?.id}
                target="__blank"
              >
                {row?.item?.name}
              </a>
            </span>
            <br />
            <span className="atvId"> #{row?.item?.id} </span>-{" "}
            <span className="atvPrd"> {row?.item?.product_name} </span>-{" "}
            <span className="atvTester">
              {" "}
              Tester : {row?.item?.number_of_participants}{" "}
            </span>
          </td>
          <td className="tdTimeStamps">
            <span className="atvTimeStart">
              <span className="text-bold">Start Date: </span>
              {moment(
                moment(row?.item?.start_date).format("DDMMYYYY"),
                "DDMMYYYY"
              ).fromNow()}
            </span>
            <br />
            <span className="atvBugs">
              <span className="text-bold">Bugs: </span>
              {row?.item?.total_bugs}
            </span>
          </td>
        </tr>
      )
    }

    if (row.type === "requirement_survey_invite_activity") {
      return (
        <tr key={row?.item?.requirement_survey?.id + uuidv4()}>
          <td className="tdIconWrap">
            <div className="layoutIcon type-survey">
              <DingdingOutlined />
            </div>
          </td>
          <td className="tdContent">
            <span className="atvType">Requirement Survey </span>-{" "}
            <span className="atvUrl">
              <a
                href={
                  "https://platform.utest.com/requirement-survey/" +
                  row?.item?.requirement_survey?.id
                }
                target="__blank"
              >
                {row?.item?.requirement_survey?.name}
              </a>
            </span>
          </td>
          <td className="tdTimeStamps">
            <span className="atvTimeStart">
              <span className="text-bold">End Date: </span>
              {moment(
                moment(row?.item?.requirement_survey?.end_date).format(
                  "DDMMYYYY"
                ),
                "DDMMYYYY"
              ).fromNow()}
            </span>
          </td>
        </tr>
      )
    }

    if (
      row.type === "test_case_activity" &&
      row.item?.type === "utest30/test_run_result_approval_change_progression"
    ) {
      return (
        <tr key={row?.item?.id + uuidv4()}>
          <td className="tdIconWrap">
            <div className="layoutIcon type-tc-approve">
              <DollarCircleOutlined />
            </div>
          </td>
          <td className="tdContent">
            <span className="atvType">Testcase Approved </span>-{" "}
            <span className="atvUrl">
              <a
                href={
                  "https://platform.utest.com/testcycles/" +
                  row?.item?.test_run_result?.test_cycle?.id +
                  "/testcases/" +
                  row?.item?.test_run_result?.id
                }
                target="__blank"
              >
                Testcase {row?.item?.test_run_result?.test_case?.name}
              </a>
            </span>
            <br />
            <span className="atvId">
              {" "}
              #{row?.item?.test_run_result?.test_cycle?.id}{" "}
            </span>
            -{" "}
            <span className="atvPrd">
              <a
                href={
                  "https://platform.utest.com/testcycles/" +
                  row?.item?.test_run_result?.test_cycle?.id
                }
                target="__blank"
              >
                {row?.item?.test_run_result?.test_cycle?.name}
              </a>
            </span>
          </td>
          <td className="tdTimeStamps">
            <span className="atvTimeStart">
              <span className="text-bold">Date: </span>
              {moment(
                moment(row?.date).format("DDMMYYYY"),
                "DDMMYYYY"
              ).fromNow()}
            </span>
          </td>
        </tr>
      )
    }

    // Bug Approved
    if (row.type === "bug_activity" && row.item?.bug_status_id === 2) {
      return (
        <tr key={row?.item?.bug?.id + uuidv4()}>
          <td className="tdIconWrap">
            <div className="layoutIcon type-tc-approve">
              <DollarCircleOutlined />
            </div>
          </td>
          <td className="tdContent">
            <span className="atvType">Bug Approved </span>-{" "}
            <span className="atvUrl">
              <a
                href={
                  "https://platform.utest.com/testcycles/" +
                  row?.item?.bug?.test_cycle?.id +
                  "/issues/" +
                  row?.item?.bug?.id
                }
                target="__blank"
              >
                {row?.item?.bug?.subject}
              </a>
            </span>
            <br />
            <span className="atvId"> #{row?.item?.bug?.test_cycle?.id} </span>-{" "}
            <span className="atvPrd">
              <a
                href={
                  "https://platform.utest.com/testcycles/" +
                  row?.item?.bug?.test_cycle?.id
                }
                target="__blank"
              >
                {row?.item?.bug?.test_cycle?.name}
              </a>
            </span>
          </td>
          <td className="tdTimeStamps">
            <span className="atvTimeStart">
              <span className="text-bold">Date: </span>
              {moment(
                moment(row?.date).format("DDMMYYYY"),
                "DDMMYYYY"
              ).fromNow()}
            </span>
          </td>
        </tr>
      )
    }

    // Bug Approved WNF
    if (row.type === "bug_activity" && (row.item?.bug_status_id === 4 || row.item?.bug_status_id === 12)) {
      return (
        <tr key={row?.item?.bug?.id + uuidv4()}>
          <td className="tdIconWrap">
            <div className="layoutIcon type-tc-approve">
              <DollarCircleOutlined />
            </div>
          </td>
          <td className="tdContent">
            <span className="atvType">Bug Approved (WNF) </span>-{" "}
            <span className="atvUrl">
              <a
                href={
                  "https://platform.utest.com/testcycles/" +
                  row?.item?.bug?.test_cycle?.id +
                  "/issues/" +
                  row?.item?.bug?.id
                }
                target="__blank"
              >
                {row?.item?.bug?.subject}
              </a>
            </span>
            <br />
            <span className="atvId"> #{row?.item?.bug?.test_cycle?.id} </span>-{" "}
            <span className="atvPrd">
              <a
                href={
                  "https://platform.utest.com/testcycles/" +
                  row?.item?.bug?.test_cycle?.id
                }
                target="__blank"
              >
                {row?.item?.bug?.test_cycle?.name}
              </a>
            </span>
          </td>
          <td className="tdTimeStamps">
            <span className="atvTimeStart">
              <span className="text-bold">Date: </span>
              {moment(
                moment(row?.date).format("DDMMYYYY"),
                "DDMMYYYY"
              ).fromNow()}
            </span>
          </td>
        </tr>
      )
    }

    // Bug Reject OOS
    if (row.type === "bug_activity" && row.item?.bug_status_id === 3) {
      return (
        <tr key={row?.item?.bug?.id + uuidv4()}>
          <td className="tdIconWrap">
            <div className="layoutIcon type-tc-reject">
              <DollarCircleOutlined />
            </div>
          </td>
          <td className="tdContent">
            <span className="atvType">Bug Rejected </span>- #{row?.item?.bug?.id} - {" "}
            <span className="atvUrl">
              <a
                href={
                  "https://platform.utest.com/testcycles/" +
                  row?.item?.bug?.test_cycle?.id +
                  "/issues/" +
                  row?.item?.bug?.id
                }
                target="__blank"
              >
                {row?.item?.bug?.subject}
              </a>
            </span>
            <br />
            <span className="atvId"> #{row?.item?.bug?.test_cycle?.id} </span>-{" "}
            <span className="atvPrd">
              <a
                href={
                  "https://platform.utest.com/testcycles/" +
                  row?.item?.bug?.test_cycle?.id
                }
                target="__blank"
              >
                {row?.item?.bug?.test_cycle?.name}
              </a>
            </span>
          </td>
          <td className="tdTimeStamps">
            <span className="atvTimeStart">
              <span className="text-bold">Date: </span>
              {moment(
                moment(row?.date).format("DDMMYYYY"),
                "DDMMYYYY"
              ).fromNow()}
            </span>
          </td>
        </tr>
      )
    }

    // Bug Pending
    if (row.type === "bug_activity" && row.item?.bug_status_id === 11) {
      return (
        <tr key={row?.item?.bug?.id + uuidv4()}>
          <td className="tdIconWrap">
            <div className="layoutIcon type-bug-pending">
              <BugOutlined />
            </div>
          </td>
          <td className="tdContent">
            <span className="atvType">Bug Pending </span>-{" "}
            <span className="atvUrl">
              <a
                href={
                  "https://platform.utest.com/testcycles/" +
                  row?.item?.bug?.test_cycle?.id +
                  "/issues/" +
                  row?.item?.bug?.id
                }
                target="__blank"
              >
                {row?.item?.bug?.subject}
              </a>
            </span>
            <br />
            <span className="atvId"> #{row?.item?.bug?.test_cycle?.id} </span>-{" "}
            <span className="atvPrd">
              <a
                href={
                  "https://platform.utest.com/testcycles/" +
                  row?.item?.bug?.test_cycle?.id
                }
                target="__blank"
              >
                {row?.item?.bug?.test_cycle?.name}
              </a>
            </span>
          </td>
          <td className="tdTimeStamps">
            <span className="atvTimeStart">
              <span className="text-bold">Date: </span>
              {moment(
                moment(row?.date).format("DDMMYYYY"),
                "DDMMYYYY"
              ).fromNow()}
            </span>
          </td>
        </tr>
      )
    }

    // Bug Request
    if (row.type === "bug_message_activity" && row.item?.bug) {
      return (
        <tr key={row?.item?.bug?.id + uuidv4()}>
          <td className="tdIconWrap">
            <div className="layoutIcon type-bug-request">
              <InfoCircleOutlined />
            </div>
          </td>
          <td className="tdContent">
            <span className="atvType">Bug Request Information </span>-{" "}
            <span className="atvUrl">
              <a
                href={
                  "https://platform.utest.com/testcycles/" +
                  row?.item?.bug?.test_cycle?.id +
                  "/issues/" +
                  row?.item?.bug?.id
                }
                target="__blank"
              >
                {row?.item?.bug?.subject}
              </a>
            </span>
            <br />
            <span className="atvId"> #{row?.item?.bug?.test_cycle?.id} </span>-{" "}
            <span className="atvPrd">
              <a
                href={
                  "https://platform.utest.com/testcycles/" +
                  row?.item?.bug?.test_cycle?.id
                }
                target="__blank"
              >
                {row?.item?.bug?.test_cycle?.name}
              </a>
            </span>
          </td>
          <td className="tdTimeStamps">
            <span className="atvTimeStart">
              <span className="text-bold">Date: </span>
              {moment(
                moment(row?.date).format("DDMMYYYY"),
                "DDMMYYYY"
              ).fromNow()}
            </span>
          </td>
        </tr>
      )
    }

    // Testcase Request
    if (row.type === "bug_message_activity" && !row.item?.bug) {
      return (
        <tr key={row?.item?.bug?.id + uuidv4()}>
          <td className="tdIconWrap">
            <div className="layoutIcon type-bug-request">
              <InfoCircleOutlined />
            </div>
          </td>
          <td className="tdContent">
            <span className="atvType">Testcase Request Information </span>-{" "}
            <span className="atvUrl">
              <a
                href={
                  "https://platform.utest.com/testcycles/" +
                  row?.item?.test_run_result?.test_cycle?.id +
                  "/testcases/" +
                  row?.item?.test_run_result?.id +
                  "/discussion"
                }
                target="__blank"
              >
                {row?.item?.test_run_result?.test_cycle?.name} -{" "}
                {row?.item?.test_run_result?.test_case?.name}
              </a>
            </span>
            <br />
            <span className="atvId">
              {" "}
              #{row?.item?.test_run_result?.test_cycle?.id}{" "}
            </span>
            -{" "}
            <span className="atvPrd">
              <a
                href={
                  "https://platform.utest.com/testcycles/" +
                  row?.item?.test_cycle?.id
                }
                target="__blank"
              >
                {row?.item?.test_run_result?.test_cycle?.name}
              </a>
            </span>
          </td>
          <td className="tdTimeStamps">
            <span className="atvTimeStart">
              <span className="text-bold">Date: </span>
              {moment(
                moment(row?.date).format("DDMMYYYY"),
                "DDMMYYYY"
              ).fromNow()}
            </span>
          </td>
        </tr>
      )
    }

    // Bug Message
    if (row.type === "bug_activity" && row.item?.bug_status_id === 9) {
      return (
        <tr key={row?.item?.bug?.id + uuidv4()}>
          <td className="tdIconWrap">
            <div className="layoutIcon type-bug-message">
              <CommentOutlined />
            </div>
          </td>
          <td className="tdContent">
            <span className="atvType">New Message </span>-{" "}
            <span className="atvUrl">
              <a
                href={
                  "https://platform.utest.com/testcycles/" +
                  row?.item?.bug?.test_cycle?.id +
                  "/issues/" +
                  row?.item?.bug?.id
                }
                target="__blank"
              >
                {row?.item?.bug?.subject}
              </a>
            </span>
            <br />
            <span className="atvId"> #{row?.item?.bug?.test_cycle?.id} </span>-{" "}
            <span className="atvPrd">
              <a
                href={
                  "https://platform.utest.com/testcycles/" +
                  row?.item?.bug?.test_cycle?.id
                }
                target="__blank"
              >
                {row?.item?.bug?.test_cycle?.name}
              </a>
            </span>
          </td>
          <td className="tdTimeStamps">
            <span className="atvTimeStart">
              <span className="text-bold">Date: </span>
              {moment(
                moment(row?.date).format("DDMMYYYY"),
                "DDMMYYYY"
              ).fromNow()}
            </span>
          </td>
        </tr>
      )
    }

    // Bug Message
    if (row.type === "bug_activity" && row.item?.bug_status_id === 8) {
      return (
        <tr key={row?.item?.bug?.id + uuidv4()}>
          <td className="tdIconWrap">
            <div className="layoutIcon type-bug-pending">
              <StopOutlined />
            </div>
          </td>
          <td className="tdContent">
            <span className="atvType">Bug Discard </span>-{" "}
            <span className="atvUrl">
              <a
                href={
                  "https://platform.utest.com/testcycles/" +
                  row?.item?.bug?.test_cycle?.id +
                  "/issues/" +
                  row?.item?.bug?.id
                }
                target="__blank"
              >
                {row?.item?.bug?.subject}
              </a>
            </span>
            <br />
            <span className="atvId"> #{row?.item?.bug?.test_cycle?.id} </span>-{" "}
            <span className="atvPrd">
              <a
                href={
                  "https://platform.utest.com/testcycles/" +
                  row?.item?.bug?.test_cycle?.id
                }
                target="__blank"
              >
                {row?.item?.bug?.test_cycle?.name}
              </a>
            </span>
          </td>
          <td className="tdTimeStamps">
            <span className="atvTimeStart">
              <span className="text-bold">Date: </span>
              {moment(
                moment(row?.date).format("DDMMYYYY"),
                "DDMMYYYY"
              ).fromNow()}
            </span>
          </td>
        </tr>
      )
    }

    // Cycle Locked
    if (
      row.type === "test_cycle_status_activity" &&
      row.item?.test_cycle_status_id === 3
    ) {
      return (
        <tr key={row?.item?.id + uuidv4()}>
          <td className="tdIconWrap">
            <div className="layoutIcon type-lock-cycle">
              <LockOutlined />
            </div>
          </td>
          <td className="tdContent">
            <span className="atvType">Testcycle Locked </span>-{" "}
            <span className="atvUrl">
              <a
                href={"https://platform.utest.com/testcycles/" + row?.item?.id}
                target="__blank"
              >
                {row?.item?.name}
              </a>
            </span>
            <br />
            <span className="atvId"> #{row?.item?.id} </span>-{" "}
            <span className="atvPrd"> {row?.item?.product_name} </span>-{" "}
            <span className="atvTester">
              {" "}
              Tester : {row?.item?.number_of_participants}{" "}
            </span>
          </td>
          <td className="tdTimeStamps">
            <span className="atvTimeStart">
              <span className="text-bold">Start Date: </span>
              {moment(
                moment(row?.item?.start_date).format("DDMMYYYY"),
                "DDMMYYYY"
              ).fromNow()}
            </span>
            <br />
            <span className="atvBugs">
              <span className="text-bold">Bugs: </span>
              {row?.item?.total_bugs}
            </span>
          </td>
        </tr>
      )
    }

    // Cycle Activated
    if (
      row.type === "test_cycle_status_activity" &&
      row.item?.test_cycle_status_id === 2
    ) {
      return (
        <tr key={row?.item?.id + uuidv4()}>
          <td className="tdIconWrap">
            <div className="layoutIcon type-lock-cycle">
              <PlayCircleOutlined />
            </div>
          </td>
          <td className="tdContent">
            <span className="atvType">Testcycle Activated </span>-{" "}
            <span className="atvUrl">
              <a
                href={"https://platform.utest.com/testcycles/" + row?.item?.id}
                target="__blank"
              >
                {row?.item?.name}
              </a>
            </span>
            <br />
            <span className="atvId"> #{row?.item?.id} </span>-{" "}
            <span className="atvPrd"> {row?.item?.product_name} </span>-{" "}
            <span className="atvTester">
              {" "}
              Tester : {row?.item?.number_of_participants}{" "}
            </span>
          </td>
          <td className="tdTimeStamps">
            <span className="atvTimeStart">
              <span className="text-bold">Start Date: </span>
              {moment(
                moment(row?.item?.start_date).format("DDMMYYYY"),
                "DDMMYYYY"
              ).fromNow()}
            </span>
            <br />
            <span className="atvBugs">
              <span className="text-bold">Bugs: </span>
              {row?.item?.total_bugs}
            </span>
          </td>
        </tr>
      )
    }

     // Badges Ten Follows
     if (
      row.type === "badge_activity" &&
      row.item?.badge_type === "follow_ten_badge"
    ) {
      return (
        <tr key={row?.item?.id + uuidv4()}>
          <td className="tdIconWrap">
            <div className="layoutIcon type-get-badges">
              <HeatMapOutlined />
            </div>
          </td>
          <td className="tdContent">
            <span className="atvType">You have received the <a href="https://www.utest.com/upoints" target="__blank">Making Friends</a> badge and earned <b>10</b> points</span>
          </td>
          <td className="tdTimeStamps">
            <span className="atvTimeStart">
              <span className="text-bold">Date: </span>
              {moment(
                moment(row?.date).format("DDMMYYYY"),
                "DDMMYYYY"
              ).fromNow()}
            </span>
          </td>
        </tr>
      )
    }

    // Badges 1st Follow
    if (
      row.type === "badge_activity" &&
      row.item?.badge_type === "first_follow_badge"
    ) {
      return (
        <tr key={row?.item?.id + uuidv4()}>
          <td className="tdIconWrap">
            <div className="layoutIcon type-get-badges">
              <HeatMapOutlined />
            </div>
          </td>
          <td className="tdContent">
            <span className="atvType">You have received the <a href="https://www.utest.com/upoints" target="__blank">1st Follow</a> badge and earned <b>5</b> points</span>
          </td>
          <td className="tdTimeStamps">
            <span className="atvTimeStart">
              <span className="text-bold">Date: </span>
              {moment(
                moment(row?.date).format("DDMMYYYY"),
                "DDMMYYYY"
              ).fromNow()}
            </span>
          </td>
        </tr>
      )
    }

    // Follow activity
    if (row.type === "follow_activity") {
      return (
        <tr key={row?.item?.id + uuidv4()}>
          <td className="tdIconWrap">
            <div className="layoutIcon type-get-badges">
              <HeatMapOutlined />
            </div>
          </td>
          <td className="tdContent">
            <span className="atvType"><a href={"https://www.utest.com/profile/" + row?.user?.slug + "/about"}>{row?.user?.name}</a> started following you</span>
          </td>
          <td className="tdTimeStamps">
            <span className="atvTimeStart">
              <span className="text-bold">Date: </span>
              {moment(
                moment(row?.date).format("DDMMYYYY"),
                "DDMMYYYY"
              ).fromNow()}
            </span>
          </td>
        </tr>
      )
    }
  
    return (
      <tr>
        <td></td>
        <td>
          <h6>{JSON.stringify(row)}</h6>
        </td>
        <td></td>
      </tr>
    )
  }

  useEffect(() => {
    if (tabPane === 1) {
      setIsLoading(true)
      const user = getUser()
      if (user) {
        axios
          .get(UTEST_API.GET_ACTIVITY + "?page=" + pageActivity, {
            headers: { Authorization: "Token " + getToken() }
          })
          .then((res) => {
            setIsLoading(false)
            if (res.data.data) {
              setListActivity([...listActivity, ...res.data.data])
            }
          })
          .catch((error) => {
            setIsLoading(true)
            setAlert(
              <ShowSweetAlert
                type="danger"
                title="Error"
                message={error.response}
                onClick={handleClickAlert}
              ></ShowSweetAlert>
            )
          })
      }
    }
    if (tabPane === 2) {
      setIsLoading(true)
      const user = getUser()
      if (user) {
        axios
          .get(UTEST_API.GET_PAYMENT, {
            headers: { Authorization: "Token " + getToken() }
          })
          .then((res) => {
            setIsLoading(false)
            if (res.data.data) {
              setData(res.data.data)
              setCurrentPayment(res.data.data[0].id)
              setTotalPayout(res.data.totalPayout)
              setPendingPayout(res.data.pendingPayout)
            }
          })
          .catch((error) => {
            setIsLoading(true)
            setAlert(
              <ShowSweetAlert
                type="danger"
                title="Error"
                message={error.response}
                onClick={handleClickAlert}
              ></ShowSweetAlert>
            )
          })
      }
    }
  // eslint-disable-next-line
  }, [tabPane, pageActivity])

  useEffect(() => {
    if (tabPane === 2) {
      if (currentUser !== 0) {
        setIsLoading(true)
        const user = getUser()
        if (user) {
          axios
            .get(
              UTEST_API.GET_PAYMENT + "?utest_payment_id=" + currrentPayment,
              {
                headers: { Authorization: "Token " + getToken() }
              }
            )
            .then((res) => {
              setIsLoading(false)
              setListPayment(res.data.data)
            })
            .catch((error) => {
              setIsLoading(true)
              setAlert(
                <ShowSweetAlert
                  type="danger"
                  title="Error"
                  message={error.response}
                  onClick={handleClickAlert}
                ></ShowSweetAlert>
              )
            })
          if (isEmpty(profile)) {
            axios
              .get(UTEST_API.GET_PROFILE, {
                headers: { Authorization: "Token " + getToken() }
              })
              .then((res) => {
                setProfile(res.data.data)
              })
              .catch((error) => {
                setIsLoading(true)
                setAlert(
                  <ShowSweetAlert
                    type="danger"
                    title="Error"
                    message={error.response}
                    onClick={handleClickAlert}
                  ></ShowSweetAlert>
                )
              })
          }
        }
      }
    }
  // eslint-disable-next-line
  }, [currrentPayment, tabPane])

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
      <Tabs defaultActiveKey="1" onChange={changeTabsPane}>
        <TabPane tab="Overview" key="1">
          <div className="listActivity">
            <table className="tableAct">
              <tbody>
                {listActivity &&
                  listActivity.length &&
                  listActivity.map((item) => renderActivity(item))}
              </tbody>
            </table>
          </div>
          <br />
          <Button type="primary" onClick={getNewActivity}>
            Load more Activity
          </Button>
        </TabPane>
        <TabPane tab="Payment History" key="2">
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col xs={24}>
              <div className="boxUtestInfoPayment">
                <div className="infoUtest">
                  <div className="avatarUtest">
                    <img
                      src={profile?.avatar_url}
                      alt="This is avatar of utest"
                    />
                  </div>
                  <div className="nameUtest">{profile?.name}</div>
                  <div className="emailUtest">{profile?.email}</div>
                  <div className="idUtest">{profile?.platform_id}</div>
                </div>
                <div className="payoutUtest">
                  <table>
                    <tr>
                      <td>
                        <span className="paymentTitle">Pending Payout : </span>
                      </td>
                      <td>
                        <span className="moneyPoint">
                          {formatMoney(parseFloat(pendingPayout))}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="paymentTitle">Total Payout : </span>
                      </td>
                      <td>
                        <span className="moneyPoint">
                          {formatMoney(parseFloat(totalPayout))}
                        </span>
                      </td>
                    </tr>
                  </table>
                </div>
                <div className="badgesPlatform">
                  <table className="badgesTable">
                    <tr>
                      <td>
                        <span class="testing-type-icon testing-type-3139"></span>
                      </td>
                      <td>
                        {responseBadges(profile?.platform_badges?.functional)}
                      </td>
                      <td className="spaceTable"></td>
                      <td>
                        <span class="testing-type-icon testing-type-3140"></span>
                      </td>
                      <td>
                        {responseBadges(profile?.platform_badges?.usability)}
                      </td>
                      <td className="spaceTable"></td>
                      <td>
                        <span class="testing-type-icon testing-type-3141"></span>
                      </td>
                      <td>{responseBadges(profile?.platform_badges?.load)}</td>
                      <td className="spaceTable"></td>
                      <td>
                        <span class="testing-type-icon testing-type-3142"></span>
                      </td>
                      <td>
                        {responseBadges(profile?.platform_badges?.security)}
                      </td>
                      <td className="spaceTable"></td>
                      <td>
                        <span class="testing-type-icon testing-type-3570"></span>
                      </td>
                      <td>
                        {responseBadges(profile?.platform_badges?.localization)}
                      </td>
                      <td className="spaceTable"></td>
                      <td>
                        <span class="testing-type-icon testing-type-38038"></span>
                      </td>
                      <td>{responseBadges("unrated")}</td>
                    </tr>
                  </table>
                </div>
                <div className="summaryUtest">
                  <span>{profile?.professional_summary}</span>
                </div>
              </div>
            </Col>
            <Col xs={24} xl={6}>
              <Table
                dataSource={data}
                columns={columns}
                onRow={(record) => ({
                  onClick: (e) => {
                    if (record.id !== undefined) {
                      setCurrentPayment(record.id)
                    } else {
                      callPreApprovePayment()
                    }
                  }
                })}
              />
            </Col>
            <Col xs={24} xl={18}>
              <Table
                dataSource={listPayment}
                columns={columnsPayment}
                className="table-responsive tablePaymentList"
                rowKey={uuidv4()}
                style={{ backgroundColor: "white" }}
              />
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default UtestOverview
