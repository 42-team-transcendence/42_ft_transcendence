import { useState, useEffect, } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// =============================================================================
// IMPORT COMPONENTS AND TYPES =================================================
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import PageWrapper from "../../navbar/pageWrapper";
import NickModal from "../../profile/NicknameModal";
import StatusModal from "./ChannelParamsStatusModal";

import { statuses, Status } from "../types";

import ChannelParamsParticipants from "./ChannelParamsParticipants";
import ChannelParamsAdmins from "./ChannelParamsAdmins";
import ChannelParamsMutes from "./ChannelParamsMutes";
import ChannelParamsBans from "./ChannelParamsBans";

// =============================================================================
// IMPORT STYLES ===============================================================
import {Box} from '@mui/material';

import "../../../styles/chat/ChanCreationParam.css"

// =============================================================================
// FUNCTION ====================================================================

export default function ChannelParams() {
	const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();
    const location = useLocation(); //sert a recuperer le state passer avec useNavigate()

    if (!location.state || !location.state.chatId)
        navigate('/chat');
        
    const [chatId, setChatId] = useState<number>(location.state.chatId);
    const [name, setName] = useState<string>();
    const [nameModal, setNameModal] = useState<boolean>(false);

    const [status, setStatus] = useState<Status>('PUBLIC');
    const [statusModal, setStatusModal] = useState<boolean>(false);
    const [pwd, setPwd] = useState<string>('');

    const [participants, setParticipants] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [bans, setBans] = useState([]);
    const [mutes, setMutes] = useState([]);

    //GET CURRENT CHANNEL
    useEffect(() => {
        const getChat = async () => {
            const response = await axiosPrivate.get(`/chats/findById/${location.state.chatId}`, {
                headers: { 'Content-Type': 'application/json'},
                withCredentials: true
            })
            setChatElements(response.data);
        }
        getChat();
    },[location.state.chatId])

    const setChatElements = (channel:any) => {
        setChatId(channel.id)
        setName(channel.channelInfo.name);
        setStatus(channel.channelInfo.status);
        setPwd(channel.channelInfo.password ? channel.channelInfo.password: '');
        setParticipants(channel.participants);
        setAdmins(channel.channelInfo.administrators);
        setBans(channel.channelInfo.bannedUsers);
        setMutes(channel.channelInfo.mutedUsers);
    }

	const SaveName = async (newName: string) => {
        if (newName != name) {
            try {
                const response = await axiosPrivate.post(
                    `channels/update/${chatId}`,
                    JSON.stringify({ name: newName }),{
                        headers: {'Content-Type': 'application/json'}, withCredentials: true
                    }
                );
                setName(newName)
            } catch (err: any) {
                console.log(err);
            }
        }
		setNameModal(!nameModal);
	};

    const SaveStatus = async (newStatus: Status, newPwd: string) => {
        if (newStatus != status || newStatus === 'PROTECTED' && newPwd != pwd) {
            try {
                const response = await axiosPrivate.post(
                    `channels/update/${chatId}`,
                    JSON.stringify({
                        status: newStatus != status ? newStatus: null,
                        password: newStatus === 'PROTECTED' && newPwd != pwd ? newPwd: null
                    }), {
                        headers: {'Content-Type': 'application/json'},withCredentials: true
                    }
                );
                setStatus(newStatus)
                if (newStatus === 'PROTECTED' && newPwd != pwd)
                    setPwd(newPwd)
            } catch (err: any) {
                console.log(err);
            }
        }
		setStatusModal(!statusModal);
	};

    return (
        <PageWrapper> { 
        participants && name && status && (pwd === '' || pwd) && admins && mutes && bans
        && (
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
                <ChannelParamsParticipants
                    chatId={chatId}
                    participants={participants}
                    setParticipants={setParticipants}
                    admins={admins}
                    setAdmins={setAdmins}
                    bans={bans}
                    setBans={setBans}
                    mutes={mutes}
                    setMutes={setMutes}
                ></ChannelParamsParticipants>
                <ChannelParamsAdmins chatId={chatId} admins={admins} setAdmins={setAdmins}></ChannelParamsAdmins>
                <ChannelParamsMutes chatId={chatId} mutes={mutes} setMutes={setMutes}></ChannelParamsMutes>
                <ChannelParamsBans chatId={chatId} bans={bans} setBans={setBans}></ChannelParamsBans>

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
