import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// =============================================================================
// IMPORT COMPONENTS AND TYPES =================================================
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import PageWrapper from "../../navbar/pageWrapper";
import NickModal from "../../profile/NicknameModal";
import StatusModal from "./StatusModal";

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

    if (!location.state)
        navigate('/chat');

    const [name, setName] = useState(location.state.chat.channelInfo.name);
    const [nameModal, setNameModal] = useState(false);

    const [status, setStatus] = useState(location.state.chat.channelInfo.status);
    const [statusModal, setStatusModal] = useState(false);
    const [pwd, setPwd] = useState(location.state.chat.channelInfo.password);

    const [participants, setParticipants] = useState(location.state.chat.participants);
    const [admins, setAdmins] = useState(location.state.chat.channelInfo.administrators);
    const [bans, setBans] = useState(location.state.chat.channelInfo.bannedUsers);
    const [mutes, setMutes] = useState(location.state.chat.channelInfo.mutedUsers);

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
