import { useEffect, useState } from 'react';

// =============================================================================
// IMPORT STYLES ===============================================================
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

// =============================================================================
// IMPORT COMPONENTS ===========================================================
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useNavigate } from 'react-router-dom';


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  border:' 1px solid rgba(0, 0, 0, .80);',
  borderRadius: '20px',
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
//   [theme.breakpoints.up('sm')]: {
//     marginLeft: theme.spacing(1),
//     width: 'auto',
//   },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  color: '#FF8100',
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
	textOverflow:"ellipsis",
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export default function SearchAppBar() {
  const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => { //search for channels
    const searchResults = async () => {
      try {
        const response = await axiosPrivate.get(
            `/channels/getByName/${searchInput}`, {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true
            }
        );
        console.log(response.data);
        setSearchResults(response.data);
        } catch (err: any) {
            console.log(err);
        }
    }
    if (searchInput) {
      console.log("search database for", searchInput);
      searchResults();
    } else {
      setSearchResults([])
    }
  }, [searchInput])

  const handleSearchChange = (event:any) => {
    setSearchInput(event.target.value);
  };

  const handleResultClick = async (channelId:number) => {
    try {
			const response = await axiosPrivate.post(
				`/channels/join/${channelId}`,
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			);
      console.log(response.data);
		} catch (error) {
			console.error(error);
		}
	};

  return (
    <Box className='search_bar' sx={{ flexGrow: 1 }}>
        <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search for friends/channels"
              inputProps={{ 'aria-label': 'search' }}

              value={searchInput}
              onChange={handleSearchChange}
            />
        </Search>
        {searchResults.length > 0 &&
        <List subheader="Channels">
          {searchResults.map((item, idx) => {
            return (
                <ListItem disablePadding key={idx}>
                  <ListItemButton onClick={() => handleResultClick(item.id)}>
                    <ListItemText primary={item.channelInfo.name} />
                  </ListItemButton>
                </ListItem>
            )})}
        </List>
        }
    </Box>
  );
}
