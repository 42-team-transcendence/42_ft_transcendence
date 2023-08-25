import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// =============================================================================
// IMPORT COMPONENTS AND TYPES =================================================
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import PageWrapper from "../navbar/pageWrapper";
import NickModal from "../profile/NicknameModal";
import StatusModal from "./StatusModal";

import { statuses, Status } from "./types";
import tchoupi from '../../assets/tchoupi50x50.jpg'
import { MiniatureUser } from "../../utils/types";
import Miniature from "../miniature/Miniature";

// =============================================================================
// IMPORT STYLES ===============================================================
import {Box, Button, Checkbox, Fab, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader,} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SchoolIcon from '@mui/icons-material/School';
import "../../styles/chat/ChanCreationParam.css"


// =============================================================================
// FUNCTION ====================================================================

export default function ChannelParams() {
	const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();
    const location = useLocation(); //sert a recuperer le state passer avec useNavigate()

    if (!location.state)
        navigate('/chat');

    const [name, setName] = useState(location.state.chat.channelInfo.name);
    const [nameModal, setNameModal] = useState(false);

    const [status, setStatus] = useState(location.state.chat.channelInfo.status);
    const [statusModal, setStatusModal] = useState(false);
    const [pwd, setPwd] = useState(location.state.chat.channelInfo.password);

    const [participants, setParticipants] = useState(location.state.chat.participants);
    const [admins, setadmins] = useState(location.state.chat.channelInfo.administrators);
    const [bans, setBans] = useState(location.state.chat.channelInfo.bannedUsers);
    const [mutes, setMutes] = useState(location.state.chat.channelInfo.mutedUsers);


    console.log(location.state.chat.channelInfo);

	const SaveName = async (newName: string) => {
        setName(newName)
		setNameModal(!nameModal);
	};

    const SaveStatus = async (newStatus: string, newPwd: string) => {
        setStatus(newStatus)
        setPwd(newPwd)
		setStatusModal(!statusModal);
	};

    return (
        <PageWrapper> {
        location.state.chat && (
            <Box className="chan-creation-param-container">
                <Box className="chan-param-subcontainer">
                    <div className="a-modifier">
                        <div>NAME: {name}</div>
                        <span className="modifier" onClick={() => setNameModal(!nameModal)}>modifier</span>
                    </div>
                    <div className="a-modifier">
                        <div>STATUS: {status}</div>
                        <span className="modifier" onClick={() => setStatusModal(!statusModal)}>modifier</span>
                    </div>
                </Box>
                <List subheader={<ListSubheader>Participants</ListSubheader>}>
                    {participants.map((user:any, idx:number) => {
                        const miniatureUser: MiniatureUser = {
                            nickname: user?.nickname,
                            id: user?.id,
                            minAvatar: {url: tchoupi, name:'Tchoupi'}
                        }
                        return (
                            <ListItem key={idx} disablePadding>
                                <Miniature miniatureUser={miniatureUser} ></Miniature>
                                <ListItemButton>
                                    <ListItemText id={idx+"promote"} primary={`promote`} />
                                    <IconButton edge="end" aria-label="delete"><SchoolIcon /></IconButton>
                                </ListItemButton>
                                <ListItemButton>
                                    <ListItemText id={idx+"delete"} primary={`kick`} />
                                    <IconButton edge="end" aria-label="delete"><DeleteIcon /></IconButton>
                                </ListItemButton>
                            </ListItem>
                        )})}
                </List>

                <List subheader={<ListSubheader>Admins</ListSubheader>}>
                    {admins.map((user:any, idx:number) => {
                        const miniatureUser: MiniatureUser = {
                            nickname: user?.nickname,
                            id: user?.id,
                            minAvatar: {url: tchoupi, name:'Tchoupi'}
                        }
                        return (
                            <ListItem key={idx} disablePadding>
                                <Miniature miniatureUser={miniatureUser} ></Miniature>
                                <ListItemButton role={undefined}>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={true}
                                        />
                                    </ListItemIcon>
                                </ListItemButton>
                                <ListItemText id={idx+"delete"} primary={`delete`} />
                                <ListItemButton>
                                    <IconButton edge="end" aria-label="delete">
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemButton>
                            </ListItem>
                        )})}
                </List>

                <List subheader={<ListSubheader>Banned Users</ListSubheader>}>
                    {bans.map((user:any, idx:number) => {
                        const miniatureUser: MiniatureUser = {
                            nickname: user?.nickname,
                            id: user?.id,
                            minAvatar: {url: tchoupi, name:'Tchoupi'}
                        }
                        return (
                            <ListItem key={idx} disablePadding>
                                <Miniature miniatureUser={miniatureUser} ></Miniature>
                                <ListItemButton role={undefined}>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={true}
                                        />
                                    </ListItemIcon>
                                </ListItemButton>
                                <ListItemText id={idx+"delete"} primary={`delete`} />
                                <ListItemButton>
                                    <IconButton edge="end" aria-label="delete">
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemButton>
                            </ListItem>
                        )})}
                </List>

                <NickModal
                    open={nameModal}
                    onClose={() => setNameModal(!nameModal)}
                    onSave={SaveName}
                />
                <StatusModal
                    open={statusModal}
                    onClose={() => setStatusModal(!statusModal)}
                    onSave={SaveStatus}
                    data={{status, pwd}}
                />
            </Box>
        )}
        </PageWrapper>
    )
}
