// import React, { useState, useEffect } from 'react';
// import SearchAppBar from './SearchBar';
// import CustomButton from "../../styles/buttons/CustomButton";
// import Box from '@mui/material/Box';
// import Logout from '../logout/Logout';
// import '../../styles/Navbar.css';
// import { IconButton } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
// import CloseIcon from '@mui/icons-material/Close';
// import { Routes, Route } from 'react-router-dom';
// import { Link } from 'react-router-dom'; // Add this import statement


// function Navbar() {
//   const [isBurgerOpen, setIsBurgerOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 1050);

//   const toggleBurgerMenu = () => {
//     setIsBurgerOpen(!isBurgerOpen);
//   };

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 1050);
//     };

//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('resize', handleResize);
//     };
//   }, []);

//   return (
//     <header className={`header ${isBurgerOpen ? 'menu-open' : ''}`}>
//       <h2>PONG</h2>
//       {(isMobile && !isBurgerOpen) ? (
//         <IconButton
//           className={`burger ${isBurgerOpen ? 'open' : ''}`}
//           color="inherit"
//           onClick={toggleBurgerMenu}
//         >
//           {isBurgerOpen ? <CloseIcon /> : <MenuIcon />}
//         </IconButton>
//       ) : (
//         <nav className={`menu ${isBurgerOpen ? 'burger-menu' : ''}`}>
//           <a className='textMenu'>Play</a>
//           <a className='textMenu'>Chat & Channels</a>
//           <a className='textMenu'>Friends List</a>
//           <a className='textMenu'>View/Change profile</a>
//           <SearchAppBar />
//           <Logout />
//         </nav>
//       )}
//     </header>
//   );
// }

// export default Navbar;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchAppBar from './SearchBar';
import CustomButton from "../../styles/buttons/CustomButton";
import Box from '@mui/material/Box';
import Logout from '../logout/Logout';
import '../../styles/Navbar.css';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Profile from '../profile/Profile';

function Navbar() {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

  const toggleBurgerMenu = () => {
    setIsBurgerOpen(!isBurgerOpen);
  };

  return (
    <header className={`header ${isBurgerOpen ? 'menu-open' : ''}`}>
      <h2>PONG</h2>
      <nav className={`menu ${isBurgerOpen ? 'burger-menu' : ''}`}>
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/play" className="nav-link">Play</Link>
        <Link to="/chat" className="nav-link">Chat & Channels</Link>
        <Link to="/friendlist" className="nav-link">Friends List</Link>
        <Link to="/profile" className="nav-link">View/Change Profile</Link>
        <SearchAppBar />
        <Logout />
      </nav>
      <IconButton
        className={`burger ${isBurgerOpen ? 'open' : ''}`}
        color="inherit"
        onClick={toggleBurgerMenu}
      >
        {isBurgerOpen ? <CloseIcon /> : <MenuIcon />}
      </IconButton>
    </header>
  );
}

export default Navbar;
