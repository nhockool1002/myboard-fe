import { makeStyles } from "@material-ui/core/styles";
import alertStyles from "assets/jss/sweetAlertStyle.js";
import SweetAlert from "react-bootstrap-sweetalert";
import Moment from "moment";

// return the user data from the session storage
export const getUser = () => {
  const userStr = sessionStorage.getItem("user");
  if (userStr) return JSON.parse(userStr);
  else return null;
};

// return the token from the session storage
export const getToken = () => {
  return sessionStorage.getItem("token") || null;
};

// remove the token and user from the session storage
export const removeUserSession = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
};

// set the token and user from the session storage
export const setUserSession = (token, user) => {
  sessionStorage.setItem("token", token);
  sessionStorage.setItem("user", JSON.stringify(user));
};

export function ShowSweetAlert({ type, title, message, onClick }) {
  const useAlertStyles = makeStyles(alertStyles);
  const alertClasses = useAlertStyles();
  function handleAction() {
    if (onClick) {
      onClick(false);
    }
  }

  const error = type === "danger" ? true : false;
  const success = type === "success" ? true : false;
  const cls = type === "danger" ? alertClasses.danger : alertClasses.success;

  return (
    <SweetAlert
      success={success}
      error={error}
      style={{ display: "block" }}
      title={title}
      onConfirm={handleAction}
      confirmBtnCssClass={alertClasses.button + " " + cls}
    >
      {message}
    </SweetAlert>
  );
}

export function dateFormat(date, type = "YYYY-MM-DD HH:mm") {
  if (Moment(date, Moment.ISO_8601, true).isValid()) {
    return Moment.utc(date).format(type);
  }
  return "";
}
