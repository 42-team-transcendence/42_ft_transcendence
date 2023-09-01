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

    const [currentUser, setCurrentUser] = useState<any>();

    const [chatId, setChatId] = useState<number>(location.state.chatId);
    const [channelInfoId, setChannelInfoId] = useState<number>();
    const [name, setName] = useState<string>();
    
    const [nameModal, setNameModal] = useState<boolean>(false);

    const [status, setStatus] = useState<Status>('PUBLIC');
    const [statusModal, setStatusModal] = useState<boolean>(false);
    const [pwd, setPwd] = useState<string>('');

    const [ownerId, setOwnerId] = useState<number>();
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
            //Si currentUser ne fait pas parti du channel 
            //ou est ban du channel, redirection hors du channel
            if (
                !response.data.participants.find((e:any)=>e.id === currentUser.id) ||
                response.data.channelInfo.bannedUsers.find((e:any)=>e.id === currentUser.id)
            )
                navigate('/chat');
            setChatElements(response.data);
        }
        if (currentUser)
            getChat();
    },[location.state.chatId, currentUser])

    const setChatElements = (channel:any) => {
        setChatId(channel.id)
        setName(channel.channelInfo.name);
        setChannelInfoId(channel.channelInfo.id);
        setStatus(channel.channelInfo.status);
        setPwd(channel.channelInfo.password ? channel.channelInfo.password: '');
        setParticipants(channel.participants);
        setAdmins(channel.channelInfo.administrators);
        setBans(channel.channelInfo.bannedUsers);
        setMutes(channel.channelInfo.mutedUsers);
        setOwnerId(channel.channelInfo.ownerId);
    }

    useEffect(() => { //Fetch current user data
		const getCurrentUser = async () => { //definition de la fonction
			try {
                const response = await axiosPrivate.get('/users/me', {
                    headers: { 'Content-Type': 'application/json'},
                    withCredentials: true
                })
                setCurrentUser(response.data);
			} catch (error:any) {
				console.log(error.response );
			}
		}
		getCurrentUser(); //appel de la fonction
    }, [])

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
                console.log(err.response);
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
                console.log(err.response);
            }
        }
		setStatusModal(!statusModal);
	};

    return (
        <PageWrapper> {
        participants && name && status && (pwd === '' || pwd) && admins && mutes && bans
        && ownerId && currentUser && channelInfoId && (
            <Box className="chan-creation-param-container">
                <Box className="chan-param-subcontainer">
                    <div className="a-modifier">
                        <div>NAME: {name}</div>
                        {admins.find((e:any) => e.id === currentUser.id) &&
                            <span className="modifier" onClick={() => setNameModal(!nameModal)}>modifier</span>
                        }
                    </div>
                    <div className="a-modifier">
                        <div>STATUS: {status}</div>
                        {(ownerId === currentUser.id) &&
                            <span className="modifier" onClick={() => setStatusModal(!statusModal)}>modifier</span>
                        }
                    </div>
                </Box>
                <ChannelParamsParticipants
                    chatId={chatId}
                    channelInfoId={channelInfoId}
                    participants={participants}
                    setParticipants={setParticipants}
                    admins={admins}
                    setAdmins={setAdmins}
                    bans={bans}
                    setBans={setBans}
                    mutes={mutes}
                    setMutes={setMutes}
                    ownerId={ownerId}
                    currentUser={currentUser}
                ></ChannelParamsParticipants>
                <ChannelParamsAdmins
                    chatId={chatId}
                    admins={admins}
                    setAdmins={setAdmins}
                    ownerId={ownerId}
                    currentUser={currentUser}
                ></ChannelParamsAdmins>
                <ChannelParamsMutes
                    chatId={chatId}
                    channelInfoId={channelInfoId}
                    mutes={mutes}
                    setMutes={setMutes}
                    currentUser={currentUser}
                    admins={admins}
                ></ChannelParamsMutes>
                <ChannelParamsBans
                    chatId={chatId}
                    bans={bans}
                    setBans={setBans}
                    currentUser={currentUser}
                    admins={admins}
                ></ChannelParamsBans>

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
