import React, { useEffect, useState } from 'react';
import { Box, MenuItem, TextField } from '@mui/material';
import PageWrapper from "../navbar/pageWrapper";
import { boardBackground } from './types';
import Play from './Play';
import '../../styles/Play.css'

const Background:React.FC = () => {

    const [selectedBackground, setSelectedBackground] = useState<string>('');
    const [backgroundSelected, setBackgroundSelected] = useState<boolean>(false);

    useEffect(() => {
        if (selectedBackground !== '') {
            setBackgroundSelected(true);
        }

    }, [selectedBackground])

	return (
		<PageWrapper>
        {!backgroundSelected && <section className="chan-creation-param-container">
            <Box component="form" 				sx={{
                        display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						'& .MuiTextField-root': { m: 1, width: '25ch' },
					}} >
            
             <TextField
                select
                label="Backgrounds"
                name="Backgrounds"
                helperText="Please choose the background of your game"
                value={selectedBackground}
                onChange={e => setSelectedBackground(e.target.value)} >
                
                    {boardBackground.map((st: string, index) => (
                        <MenuItem key={index} value={st}>
                            <img src={st} style={{ border: '2px solid black', width: '70px', height: '60px', marginRight: '30px', marginLeft: '60px' }} />
                        </MenuItem>
                    ))}
            </TextField>
            </Box>
            </section>
        }
            {backgroundSelected && <Play selectedBackground={selectedBackground} />}
		</PageWrapper>
	)
  }

export default Background;