import {Box, styled} from '@mui/material'
import Miniature from "../miniature/Miniature";



const MsgInConv = styled('li')(({ theme }) => ({
    border:' 1px solid black',
    borderRadius: '10px',
    backgroundColor: 'pink',
    marginTop: 15,
    width: '70%',
}));

export default function MessageInConv({content, sender}: any) {

    return (
        <Box sx={{ justifyContent: 'flex-start' }}>
            <Miniature nickname={sender?.nickname}></Miniature>
            <MsgInConv>{content}</MsgInConv>
        </Box>

    )

}