import {Box, styled} from '@mui/material'
import Miniature from "../miniature/Miniature";



const MsgInConv = styled('div')(({ theme }) => ({
    border:' 1px solid black',
    borderRadius: '10px',
    backgroundColor: 'pink',
    // marginTop: 15,
    width: '60%',
}));

export default function MessageInConv({content, sender, currentUser}: any) {
    return (
        <Box sx={sender.id === currentUser.sub ? {ml:'150px', mt:'10px'}:{ mt:'10px'}}>
            <Miniature nickname={sender?.nickname}></Miniature>
            <MsgInConv>{content}</MsgInConv>
        </Box>

    )
}