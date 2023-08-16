import React from "react";
import Avatar from "@mui/material/Avatar";
import { deepOrange } from "@mui/material/colors";

import Miniature from "../miniature/Miniature";

type MessageProps = {
  message: string;
  timestamp: string; // Adjust the type as needed
  photoURL?: string;
  displayName?: string;
};

const useStyles: any = {
  messageRow: {
    display: "flex",
  },
  messageRowRight: {
    display: "flex",
    justifyContent: "flex-end",
  },
  messageBlue: {
    position: "relative",
    marginLeft: "20px",
    marginBottom: "10px",
    padding: "10px",
    backgroundColor: "#A8DDFD",
    width: "60%",
    textAlign: "left",
    font: "400 .9em 'Open Sans', sans-serif",
    border: "1px solid #97C6E3",
    borderRadius: "10px",
  },
  messageOrange: {
    position: "relative",
    marginRight: "20px",
    marginBottom: "10px",
    padding: "10px",
    backgroundColor: "#f8e896",
    width: "60%",
    textAlign: "left",
    font: "400 .9em 'Open Sans', sans-serif",
    border: "1px solid #dfd087",
    borderRadius: "10px",
  },
  messageContent: {
    padding: 0,
    margin: 0,
  },
  messageTimeStampRight: {
    position: "absolute",
    fontSize: ".85em",
    fontWeight: "300",
    marginTop: "10px",
    bottom: "-3px",
    right: "5px",
  },
  orangeAvatar: {
    color: "white",
    backgroundColor: deepOrange[500],
    width: "32px",
    height: "32px",
  },
  displayName: {
    marginLeft: "20px",
  },
};

// Avatar is on the left
export const MessageLeft: React.FC<MessageProps> = (props) => {
  const { message, timestamp, photoURL, displayName, } = props;

  return (
    <div style={useStyles.messageRow}>
      <Avatar
        alt={displayName}
        sx={useStyles.orangeAvatar}
        src={photoURL}
      ></Avatar>
      <div style={useStyles.displayName}>{displayName}</div>
      <div style={useStyles.messageBlue}>
        <div>
          <p style={useStyles.messageContent}>{message}</p>
        </div>
        <div style={useStyles.messageTimeStampRight}>{timestamp}</div>
      </div>
    </div>
  );
};

// Avatar is on the right
export const MessageRight: React.FC<MessageProps> = (props) => {
  const { message, timestamp } = props;

  return (
    <div style={useStyles.messageRowRight}>
      <div style={useStyles.messageOrange}>
        <p style={useStyles.messageContent}>{message}</p>
        <div style={useStyles.messageTimeStampRight}>{timestamp}</div>
      </div>
    </div>
  );
};
