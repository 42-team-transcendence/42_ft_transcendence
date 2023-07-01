import React, { useState, useEffect } from 'react';
import SearchAppBar from './SearchBar';
import CustomButton from "../../styles/buttons/CustomButton";
import Box from '@mui/material/Box';
import Logout from '../logout/Logout';
import '../../styles/Navbar.css';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

function Navbar() {
	const [showLinks, setShowLinks] = useState(false)

	const handleShowLinks = () => {
		setShowLinks(!showLinks)
	}

	return (

		<nav className={`navbar  ${showLinks ? "show_nav" : "hide_nav"}`}>
			<div className='navbar_logo'> PONG </div>
			<ul className='navbar_links'>
				<li className='navbat_items'>
				<a href='/' className='navbar_link'>Play</a>
				</li>
				<li className='navbat_items'>
				<a href='/' className='navbar_link'>Chat & Channels</a>
				</li>
				<li className='navbat_items'>
				<a href='/' className='navbar_link'>Friends List</a>
				</li>
				<li className='navbat_items'>
				<a href='/' className='navbar_link'>View/Change profile</a>
				</li>
				<li className='navbat_items'>
					<SearchAppBar />
				</li>
				<li className='navbat_items'>
					<Logout />
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
