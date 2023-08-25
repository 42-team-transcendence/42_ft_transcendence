import { useState, useEffect, useRef } from "react";
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
    const shouldSaveRef = useRef(false); //React useRef hook to control updates on re-renders 
	const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();
    const location = useLocation(); //sert a recuperer le state passer avec useNavigate()

    if (!location.state || !location.state.chatId)
        navigate('/chat');

    const [name, setName] = useState<string>();
    const [nameModal, setNameModal] = useState<boolean>(false);

    const [status, setStatus] = useState<Status>('PUBLIC');
    const [statusModal, setStatusModal] = useState<boolean>(false);
    const [pwd, setPwd] = useState<string>('');

    const [participants, setParticipants] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [bans, setBans] = useState([]);
    const [mutes, setMutes] = useState([]);

	const SaveName = async (newName: string) => {
        if (newName != name)
            setName(newName)
		setNameModal(!nameModal);
	};

    const SaveStatus = async (newStatus: Status, newPwd: string) => {
        setStatus(newStatus)
        setPwd(newPwd)
		setStatusModal(!statusModal);
	};

    const setChatElements = (channel:any) => {
        setName(channel.channelInfo.name);
        setStatus(channel.channelInfo.status);
        setPwd(channel.channelInfo.password ? channel.channelInfo.password: '');
        setParticipants(channel.participants);
        setAdmins(channel.channelInfo.administrators);
        setBans(channel.channelInfo.bannedUsers);
        setMutes(channel.channelInfo.mutedUsers);
    }

    //GET CURRENT CHANNEL
    useEffect(() => {
        const getChat = async () => {
            const response = await axiosPrivate.get(`/chats/findById/${location.state.chatId}`, {
                headers: { 'Content-Type': 'application/json'},
                withCredentials: true
            })
            setChatElements(response.data);
            shouldSaveRef.current = false;
        }
        getChat();
    },[])

    //UPDATE NAME
    useEffect(() => {
        const saveNameInDb = async () => {
            if (shouldSaveRef.current) {
                try {
                    const response = await axiosPrivate.post(
                        `channels/update/${location.state.chatId}`,
                        JSON.stringify({ name }),
                        {
                            headers: {'Content-Type': 'application/json'},
                            withCredentials: true
                        }
                    );
                    console.log('saveNameInDb', response.data);
                } catch (err: any) {
                    console.log(err);
                }
            } else {
                // Reset the ref value to allow subsequent calls
                shouldSaveRef.current = true;
            }
        }
        saveNameInDb();
    },[name])

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
                    participants={participants}
                    setParticipants={setParticipants}
                    admins={admins}
                    setAdmins={setAdmins}
                    bans={bans}
                    setBans={setBans}
                    mutes={mutes}
                    setMutes={setMutes}
                ></ChannelParamsParticipants>
                <ChannelParamsAdmins admins={admins} setAdmins={setAdmins}></ChannelParamsAdmins>
                <ChannelParamsMutes mutes={mutes} setMutes={setMutes}></ChannelParamsMutes>
                <ChannelParamsBans bans={bans} setBans={setBans}></ChannelParamsBans>

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
