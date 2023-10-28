import React from "react";
import { deepOrange } from "@mui/material/colors";

import {Box} from "@mui/material";
import BadgeAvatar from "../../miniature/BadgeAvatar";
import { User } from "../../../utils/types/user";

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
    backgroundColor: "#FFD0E3",
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
    backgroundColor: "#FFD2A4",
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
export const MessageLeft = ({key, message, timestamp, sender}: {
  key:number,
  message: string | JSX.Element,
  timestamp: string,
  sender?: User
}) => {
	return (
		<div style={useStyles.messageRow}>
			<Box>
				{sender ?
					<BadgeAvatar minAvatar={{ url: `http://localhost:3333/public/picture/${sender.nickname}`, name: sender.nickname }} />
					: <div>problem finding sender</div>
				}
			</Box>
			<div style={useStyles.messageBlue}>
				<div style={useStyles.messageContent}>
					<p style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap', margin: 0 }}>{message}</p>
				</div>
				<div style={useStyles.messageTimeStampRight}>{timestamp}</div>
			</div>
		</div>
	);
};

// Avatar is on the right
export const MessageRight = ({key, message, timestamp}: {
  key: number,
  message: string,
  timestamp: string
}) => {
	return (
		<div style={useStyles.messageRowRight}>
			<div style={useStyles.messageOrange}>
				<div style={useStyles.messageContent}>
					<p style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap', margin: 0 }}>{message}</p>
				</div>
				<div style={useStyles.messageTimeStampRight}>{timestamp}</div>
			</div>
		</div>
	);
};
