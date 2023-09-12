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
import SearchChanPwdModal from './ChannelPwdModal';


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  border:' 1px solid rgba(0, 0, 0, .80);',
  borderRadius: '20px',
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '80%',
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
    width: '80%',
    [theme.breakpoints.up('sm')]: {
      width: '15ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));



export default function SearchAppBar() {
  const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<any>();
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [pwdModal, setPwdModal] = useState<boolean>(false);
  const [channelPwd, setChannelPwd] = useState<string>('');
  const [channelId, setChannelId] = useState<any>();


  useEffect(() => { //Fetch current user data
		const getCurrentUser = async () => {
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
		getCurrentUser();
    }, [])

  useEffect(() => { //search for channels
    const searchResults = async () => {
      try {
        const response = await axiosPrivate.get(
            `/channels/getByName/${searchInput}`, {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true
            }
        );
        const chansNotPrivate = response.data.filter((e:any)=>e.channelInfo.status != "PRIVATE")
        setSearchResults(chansNotPrivate);
        } catch (err: any) {
            console.log(err);
        }
    }
    if (searchInput) {
      searchResults();
    } else {
      setSearchResults([])
    }
  }, [searchInput])

  const handleSearchChange = (event:any) => {
    setSearchInput(event.target.value);
  };

  const joinChannel = async (channelId:number) => {
    try { //JOIN CHANNEL
      const response = await axiosPrivate.post(
        `/channels/join/${channelId}`, {
          headers: { "Content-Type": "application/json" }, withCredentials: true,
      });
      navigate('/chat', {state: {channelId}});
      setSearchInput('');
    } catch (error) {
      console.error(error);
    }
  }

  const handleResultClick = async (channel:any) => {
    if (!channel.participants.find((e:any) => e.id === currentUser.id)) {
      if (channel.channelInfo?.status === "PROTECTED") { //OPEN PWD MODAL CHECK
        setChannelPwd(channel.channelInfo.password);
        setPwdModal(!pwdModal);
        setChannelId(channel.id);
      } else //JOIN DIRECTLY CHANNEL
          joinChannel(channel.id);
    } else {// IF USER IS ALREADY IN CHANNEL GO DIRECTLY TO CHANNEL
      navigate('/chat', {state: {channelId: channel.id}});
      setSearchInput('');
    }
	};

  const handlePwdInput = async (inputPwd: string, channelPwd: string, channelId: number) => {
    if (inputPwd != channelPwd) {
      console.log("!!! PWD IS INVALID !!!")
      setPwdModal(!pwdModal)
    } else {
      joinChannel(channelId)
      setPwdModal(!pwdModal)
      console.log("PWD IS VALID !")
    }
  };

  return (
    <Box className='search_bar' sx={{ flexGrow: 1 }}>
        <Search key="search_bar_1">
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search channels"
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
                  <ListItemButton onClick={() => handleResultClick(item)}>
                    <ListItemText primary={item.channelInfo.name} />
                  </ListItemButton>
                </ListItem>
            )
          })}
        </List>
        }
        {channelPwd &&
          <SearchChanPwdModal
          open={pwdModal}
          onClose={() => setPwdModal(!pwdModal)}
          onSave={handlePwdInput}
          channelPwd={channelPwd}
          channelId={channelId}
        />}
    </Box>
  );
}
