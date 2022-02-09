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

const listColor = [
  "#000000",
  "#e60000",
  "#ff9900",
  "#ffff00",
  "#008a00",
  "#0066cc",
  "#9933ff",
  "#ffffff",
  "#facccc",
  "#ffebcc",
  "#ffffcc",
  "#cce8cc",
  "#cce0f5",
  "#ebd6ff",
  "#bbbbbb",
  "#f06666",
  "#ffc266",
  "#ffff66",
  "#66b966",
  "#66a3e0",
  "#c285ff",
  "#888888",
  "#a10000",
  "#b26b00",
  "#b2b200",
  "#006100",
  "#0047b2",
  "#6b24b2",
  "#444444",
  "#5c0000",
  "#663d00",
  "#666600",
  "#003700",
  "#002966",
  "#3d1466",
  "custom-color",
];

export function ReactQuillToolbar() {
  const modules = {
    toolbar: [
      [{ font: [] }, { header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      [{ script: "sub" }, { script: "super" }],
      ["link", "image", { color: listColor }, { background: listColor }],
      [{ align: [] }],
      ["clean"],
    ],
  };
  const formats = [
    "font",
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
  ];
  return { modules, formats };
}

export function convertToSlug(str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
  var to   = "aaaaaeeeeeiiiiooooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
           .replace(/\s+/g, '-') // collapse whitespace and replace by -
           .replace(/-+/g, '-'); // collapse dashes

  return str;
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}