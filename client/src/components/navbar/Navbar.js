import React, { useState, useEffect } from 'react';
import SearchAppBar from './SearchBar';
import CustomButton from "../../styles/buttons/CustomButton";
import Box from '@mui/material/Box';
import Logout from '../logout/Logout';
import '../../styles/Navbar.css';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function Navbar() {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1050);

  const toggleBurgerMenu = () => {
    setIsBurgerOpen(!isBurgerOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1050);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <header className="header">
      <h2>PONG</h2>
      {(isMobile && !isBurgerOpen) ? (
        <IconButton
          className={`burger ${isBurgerOpen ? 'open' : ''}`}
          color="inherit"
          onClick={toggleBurgerMenu}
        >
          <MenuIcon />
        </IconButton>
      ) : (
        <nav className={`menu ${isBurgerOpen ? 'burger-menu' : ''}`}>
          <a className='textMenu'>Play</a>
          <a className='textMenu'>Chat & Channels</a>
          <a className='textMenu'>Friends List</a>
          <a className='textMenu'>View/Change profile</a>
          <SearchAppBar />
          <Logout />
        </nav>
      )}
    </header>
  );
}

export default Navbar;
