import React from "react";
import Avatar from "@mui/material/Avatar";
import { deepOrange } from "@mui/material/colors";

import {Box} from "@mui/material";
import BadgeAvatar from "../../miniature/BadgeAvatar";

type MessageProps = {
  message: string;
  timestamp: string; // Adjust the type as needed
  photoURL?: string;
  displayName?: string;
  sender?: string;
//   id?: string;
};

type SenderType = {
	id: number;
	nickname: string;
	url: string;
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
export const MessageLeft: React.FC<MessageProps & { recipients?: any; tchoupi?: string; sender?: SenderType }> = (
	props
  ) => {
	const { message, timestamp, displayName, recipients = [], tchoupi = "", sender } = props;
  
	return (
		<div style={useStyles.messageRow}>
		
			<Box>
				{sender ? (
					<>
					
						<BadgeAvatar minAvatar={{ url: tchoupi, name: "Tchoupi" }} />
					</>
				) : (
					<div>problem finding sender</div>
			)}
			</Box>

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



//sender.id.toString()