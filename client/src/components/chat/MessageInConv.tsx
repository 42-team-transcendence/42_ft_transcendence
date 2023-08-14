import {Box, styled} from '@mui/material'
import Miniature from "../miniature/Miniature";

import tchoupi from '../../assets/tchoupi50x50.jpg'
import alf from '../../assets/alf50x50.jpg'

const MsgInConv = styled('div')(({ theme }) => ({
    border:' 1px solid black',
    borderRadius: '10px',
    backgroundColor: 'pink',
    // marginTop: 15,
    width: '60%',
}));

export default function MessageInConv({content, sender, currentUser}: any) {
    return (
        <Box sx={sender?.id === currentUser.id ? {ml:'150px', mt:'10px'}:{ mt:'10px'}}>
            <Miniature 
                nickname={sender?.nickname}
                minAvatar={sender?.id === currentUser.id ? {url: alf, name:'Alf'}:{url: tchoupi, name:'Tchoupi'}}></Miniature>
            <MsgInConv>{content}</MsgInConv>
        </Box>

    )
}