import { Link } from 'react-router-dom';
import SearchAppBar from './SearchBar';
import Logout from '../logout/Logout';
import '../../styles/Navbar.css';

interface NavbarProps {
  showLinks: boolean;
  handleShowLinks: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ showLinks, handleShowLinks }) => {
  return (
    <nav className={`navbar ${showLinks ? "show_nav" : "hide_nav"}`}>
      <Link to="/" className='navbar_logo'> PONG </Link>
      <div className='navbar_links'>
        <Link to="/" className="navbar_link">Home</Link>
        <Link to="/play" className="navbar_link">Play</Link>
        <Link to="/chat" className="navbar_link">Chat & Channels</Link>
        <Link to="/friendlist" className="navbar_link">Friends List</Link>
        <Link to="/profile" className="navbar_link">View/Change Profile</Link>
        <SearchAppBar />
        <Logout />
      </div>
      <button className='navbar_burger' onClick={handleShowLinks}>
    	<span className='burger_bar'></span>
      </button>
    </nav>
  );
};

export default Navbar;




// import { Link } from 'react-router-dom';
// import SearchAppBar from './SearchBar';
// import Logout from '../logout/Logout';
// import '../../styles/Navbar.css';

// function Navbar({showLinks, handleShowLinks}) {

// 	return (
// 		<nav className={`navbar  ${showLinks ? "show_nav" : "hide_nav"}`}>
// 			<div className='navbar_logo'> PONG </div>
// 			<div className='navbar_links'>
// 				<Link to="/" className="navbar_link">Home</Link>
// 				<Link to="/play" className="navbar_link">Play</Link>
// 				<Link to="/chat" className="navbar_link">Chat & Channels</Link>
// 				<Link to="/friendlist" className="navbar_link">Friends List</Link>
// 				<Link to="/profile" className="navbar_link">View/Change Profile</Link>
// 				<SearchAppBar />
// 				<Logout className='logout_item'/>
// 			</div>
// 			<button className='navbar_burger' onClick={handleShowLinks}>
// 				<span className='burger_bar'></span>
// 			</button>
// 		</nav>
// 	)

// }

// export default Navbar;
