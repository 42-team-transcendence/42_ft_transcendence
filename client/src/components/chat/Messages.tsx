import {Box, styled} from '@mui/material'

const Message = styled('li')(({ theme }) => ({
    border:' 1px solid black',
    borderRadius: '10px',
    backgroundColor: 'pink',
    marginTop: 15,
    width: '70%',
}));

export default function Messages({messages}:{messages : string[]}) {

    return (
        <Box>
            <ul>
                {messages?.map((msg, index) => {
                    return <Message key={index}>{msg}</Message>
                })}
            </ul>
        </Box>
    )

}