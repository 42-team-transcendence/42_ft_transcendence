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

function Navbar({showLinks, handleShowLinks}) {
	return (

		<nav className={`navbar  ${showLinks ? "show_nav" : "hide_nav"}`}>
			<div className='navbar_logo'> PONG </div>
			<ul className='navbar_links'>
				<li className='navbar_items'>
				<a href='/' className='navbar_link'>Play</a>
				</li>
				<li className='navbar_items'>
				<a href='/' className='navbar_link'>Chat & Channels</a>
				</li>
				<li className='navbar_items'>
				<a href='/' className='navbar_link'>Friends List</a>
				</li>
				<li className='navbar_items'>
				<a href='/' className='navbar_link'>View/Change profile</a>
				</li>
				<li className='navbar_items'>
					<SearchAppBar />
				</li>
				<li className='navbar_items'>
					<Logout className='logout_item'/>
				</li>
    	 		
			</ul>
			<button className='navbar_burger' onClick={handleShowLinks}>
				<span className='burger_bar'></span>
			</button>
		</nav>
	)

}

export default Navbar;




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
