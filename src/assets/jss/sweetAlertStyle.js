import { grayColor } from "assets/jss/myboardStyle";

import buttonStyle from "assets/jss/buttonStyle";

const sweetAlertStyle = {
  cardTitle: {
    marginTop: "0",
    marginBottom: "3px",
    color: grayColor[2],
    fontSize: "18px",
  },
  center: {
    textAlign: "center",
  },
  right: {
    textAlign: "right",
  },
  left: {
    textAlign: "left",
  },
  ...buttonStyle,
};

export default sweetAlertStyle;