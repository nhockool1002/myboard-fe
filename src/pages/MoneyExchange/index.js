import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ListCurrencies from "utils/currencies.json";
import { Row, Col, Select, Card, Button, InputNumber, DatePicker, Tag } from "antd";
import { getUser, getToken } from "utils/common";
import { SELF_URL, MONEY_EXCHANGE } from "helpers/url";
import CompareIcon from "assets/images/compare.png";
import Loader from "react-loader-spinner";
import NumberFormat from "react-number-format";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import ReactApexChart from "react-apexcharts";
import { ShowSweetAlert } from "utils/common";

const MoneyExchange = (props) => {
  const { Option } = Select;
  const { RangePicker } = DatePicker;
  const history = useHistory();
  const [loading, setIsLoading] = useState(false);
  const [listKeyCurrencies, setListKeyCurrencies] = useState([]);
  const [baseCurrency, setBaseCurrency] = useState("VND");
  const [desCurrency, setDesCurrency] = useState("USD");
  const [amount, setAmount] = useState(0);
  const [result, setResult] = useState(0);
  const [alert, setAlert] = useState(false);
  const [update, setUpdate] = useState("");
  const [startDate, setStartDate] = useState(
    moment().add(-7, "days").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [listKeyHistorical, setListKeyHistorical] = useState([]);
  const [listMoneyHistorical, setListMoneyHistorical] = useState([]);
  const defaultRange = [moment(), moment().add(-7, "days")];

  const lineChart = {
    series: [
      {
        name: baseCurrency + " ≙ " + desCurrency,
        data: listMoneyHistorical,
        offsetY: 0,
      },
    ],

    options: {
      chart: {
        width: "100%",
        height: 350,
        type: "area",
        toolbar: {
          show: false,
        },
      },

      legend: {
        show: false,
      },

      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },

      yaxis: {
        labels: {
          style: {
            fontSize: "14px",
            fontWeight: 600,
            colors: ["#8c8c8c"],
          },
        },
      },

      xaxis: {
        labels: {
          style: {
            fontSize: "14px",
            fontWeight: 600,
            colors: [
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
            ],
          },
        },
        categories: listKeyHistorical,
      },

      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
    },
  };

  const handleChangeValue = (value) => {
    setBaseCurrency(value);
  };

  const handleChangeValueDes = (value) => {
    setDesCurrency(value);
  };

  const switchCurrency = () => {
    const temp = desCurrency;
    setDesCurrency(baseCurrency);
    setBaseCurrency(temp);
    setUpdate(uuidv4());
  };

  const changeAmount = (value) => {
    setAmount(value);
  };

  function onChangeDate(dates, dateStrings) {
    if (dateStrings !== null) {
      setStartDate(dateStrings[0]);
      setEndDate(dateStrings[1]);
    }
  }

  const handleClickAlert = () => {
    setAlert(null);
    setIsLoading(false);
  };

  const handleSetByFastPopular = (value) => {
    if (value !== desCurrency) {
      setBaseCurrency(value);
      setUpdate(uuidv4());
    } else {
      setAlert(
        <ShowSweetAlert
          type="danger"
          title="Error"
          message="BASE MONEY AND DES MONEY AS SAME"
          onClick={handleClickAlert}
        ></ShowSweetAlert>
      );
    }
  }

  useEffect(() => {
    const listData = [];
    Object.keys(ListCurrencies).forEach(function (key) {
      listData.push(key);
    });
    setListKeyCurrencies(listData);
  }, []);

  useEffect(() => {
    executeMoneyExchange();
    // eslint-disable-next-line
  }, [update]);

  useEffect(() => {
    setIsLoading(true);
    const user = getUser();
    if (user !== null && baseCurrency !== desCurrency) {
      axios
        .get(
          MONEY_EXCHANGE.GET_RATES_HISTORICAL +
            `?base=${baseCurrency}&des=${desCurrency}&start_date=${startDate}&end_date=${endDate}`,
          {
            headers: { Authorization: "Token " + getToken() },
          }
        )
        .then((res) => {
          setListKeyHistorical(res.data.list_key);
          setIsLoading(false);
          setListMoneyHistorical(res.data.list_historical);
        })
        .catch((error) => {
          if (
            [
              "MONEY_EXCHANGE_DOMAIN_SETTING_NOT_FOUND",
              "MONEY_EXCHANGE_KEY_SETTING_NOT_FOUND",
            ].includes(error.response.data.message)
          ) {
            history.push(SELF_URL.GENERAL_SETTINGS);
          } else {
            setIsLoading(false);
            setAlert(
              <ShowSweetAlert
                type="danger"
                title="Error"
                message={error.response.data.message}
                onClick={handleClickAlert}
              ></ShowSweetAlert>
            );
          }
        });
    }
    // eslint-disable-next-line
  }, [startDate, endDate, baseCurrency]);

  const executeMoneyExchange = () => {
    setIsLoading(true);
    const user = getUser();
    if (user !== null) {
      axios
        .get(
          MONEY_EXCHANGE.GET_EXCHANGE +
            `?base=${baseCurrency}&amount=${amount.toString()}&des=${desCurrency}`,
          {
            headers: { Authorization: "Token " + getToken() },
          }
        )
        .then((res) => {
          setIsLoading(false);
          setResult(res.data.result);
        })
        .catch((error) => {
          if (
            [
              "MONEY_EXCHANGE_DOMAIN_SETTING_NOT_FOUND",
              "MONEY_EXCHANGE_KEY_SETTING_NOT_FOUND",
            ].includes(error.response.data.message)
          ) {
            history.push(SELF_URL.GENERAL_SETTINGS);
          } else {
            setIsLoading(false);
            setAlert(
              <ShowSweetAlert
                type="danger"
                title="Error"
                message={error.response.data.message}
                onClick={handleClickAlert}
              ></ShowSweetAlert>
            );
          }
        });
    }
  };

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
      <Row>
        <Col md={12} xs={24} lg={12} sm={24}>
          <Card
            title="Money Exchange"
            extra={
              <Button type="primary" onClick={executeMoneyExchange}>
                Execute
              </Button>
            }
            style={{ width: "95%" }}
            className="moneyExchangeBox"
          >
            <Row>
            <Col md={24} xs={24} lg={24} sm={24}>
              <Tag color="magenta" onClick={() => handleSetByFastPopular("USD")}>USD</Tag>
              <Tag color="red" onClick={() => handleSetByFastPopular("EUR")}>EUR</Tag>
              <Tag color="cyan" onClick={() => handleSetByFastPopular("GBP")}>GBP</Tag>
              <Tag color="green" onClick={() => handleSetByFastPopular("AUD")}>AUD</Tag>
              <Tag color="orange" onClick={() => handleSetByFastPopular("VND")}>VND</Tag>
              <br /><br />
            </Col>
            </Row>
            <Row>
              <Col md={10} xs={24} lg={10} sm={24}>
                {listKeyCurrencies && (
                  <>
                    <h4>Base Currency: </h4>
                    <Select
                      defaultValue={baseCurrency}
                      style={{ width: "90%" }}
                      onChange={handleChangeValue}
                      value={baseCurrency}
                    >
                      {listKeyCurrencies.map((item) => (
                        <Option value={item}>{item}</Option>
                      ))}
                    </Select>
                  </>
                )}
              </Col>
              <Col md={10} xs={24} lg={10} sm={24}>
                {listKeyCurrencies && (
                  <>
                    <h4>Destination Currency: </h4>
                    <Select
                      defaultValue={desCurrency}
                      style={{ width: "90%" }}
                      onChange={handleChangeValueDes}
                      value={desCurrency}
                    >
                      {listKeyCurrencies.map((item) => (
                        <Option value={item}>{item}</Option>
                      ))}
                    </Select>
                  </>
                )}
              </Col>
              <Col md={4} xs={24} lg={4} sm={24}>
                {listKeyCurrencies && (
                  <Button type="link" onClick={switchCurrency}>
                    <img
                      src={CompareIcon}
                      style={{ width: "40px" }}
                      alt="this button for change rates"
                    />
                  </Button>
                )}
              </Col>
              <Col md={24} xs={24} lg={24} sm={24}>
                <br />
                <h4>Amount: </h4>
                <InputNumber
                  min={1}
                  style={{ width: "100%" }}
                  onChange={changeAmount}
                />
              </Col>
            </Row>
            <Row>
              <Col
                md={24}
                xs={24}
                lg={24}
                sm={24}
                className="resultMoneyExchange"
              >
                {result && (
                  <>
                    <NumberFormat
                      value={result.toFixed(2)}
                      displayType={"text"}
                      thousandSeparator={true}
                    />{" "}
                    <small>{desCurrency}</small>
                  </>
                )}
              </Col>
            </Row>
          </Card>
        </Col>
        <Col md={12} xs={24} lg={12} sm={24}>
          <Card
            title="Money LineChart"
            style={{ width: "95%" }}
            className="moneyLineChart"
          >
            <Row>
              <Col md={24} xs={24} lg={24} sm={24}>
                <h3 className="titleRatesHistorical">
                  {baseCurrency + " ≙ " + desCurrency}
                </h3>
                <h4>Choose Date: </h4>
                <RangePicker
                  defaultValue={defaultRange}
                  format="YYYY-MM-DD"
                  style={{ width: "80%" }}
                  ranges={{
                    Today: [moment(), moment()],
                    "This Month": [
                      moment().startOf("month"),
                      moment().endOf("month"),
                    ],
                  }}
                  onChange={onChangeDate}
                />
              </Col>

              <Col md={24} xs={24} lg={24} sm={24}>
                <ReactApexChart
                  className="full-width"
                  options={lineChart.options}
                  series={lineChart.series}
                  type="area"
                  height={350}
                  width={"100%"}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MoneyExchange;
