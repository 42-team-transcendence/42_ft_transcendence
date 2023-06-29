import React from 'react'
import SearchAppBar from './SearchBar';

// STYLE =====================================================
import CustomButton from "../../styles/buttons/CustomButton";
import Box from '@mui/material/Box';
import '../../styles/Navbar.css';
import Logout from '../logout/Logout';



function Navbar() {
	return (
	  <div className='navbar'>
		<h2>PONG</h2>
  
		<div className='menu'>
		  <p className='line'>Play</p>
		  <p className='line'>Chat & Channels</p>
		  <p className='line'>Friends List</p>
		  <p className='line'>View/Change profile</p>
			{/* <Link className="line">Play</Link> */}
			{/* <Link to="/chat" className="line">Log in</Link> */}
			{/* <Link to="/friends" className="line">Log in</Link> */}
			{/* <Link to="/profile" className="line">Log in</Link> */}
			{/* <Link to="/logout" className="line">Log in</Link> */}
		</div>
  
		<div><SearchAppBar /></div>
		<div className='line'><Logout /></div>
	  </div>
	)
  }
  

export default Navbar