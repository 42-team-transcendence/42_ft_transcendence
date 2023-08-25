import { Link } from 'react-router-dom';

// =============================================================================
// IMPORT COMPONENTS ===========================================================
import SearchAppBar from './SearchBar';
import Logout from '../logout/Logout';

// =============================================================================
// IMPORT STYLES ===============================================================
import '../../styles/Navbar.css';

// =============================================================================
// INTERFACE ===================================================================
interface NavbarProps {
  	showLinks: boolean;
  	handleShowLinks: () => void;
}
// =============================================================================
// FUNCTION ====================================================================

const Navbar: React.FC<NavbarProps> = ({ showLinks, handleShowLinks }) => {
	return (
			<nav className={`navbar ${showLinks ? "show_nav" : "hide_nav"}`}>
				<Link to="/" className='navbar_logo'> PONG </Link>
				<SearchAppBar />
				<div className='navbar_links'>
					<Link to="/" className="navbar_link">Home</Link>
					<Link to="/play" className="navbar_link">Play</Link>
					<Link to="/chat" className="navbar_link">Chat & Channels</Link>
					<Link to="/friendlist" className="navbar_link">Friends List</Link>
					<Link to="/profile" className="navbar_link">View/Change Profile</Link>
					<Logout />
				</div>
				<button className='navbar_burger' onClick={handleShowLinks}>
					<span className='burger_bar'></span>
				</button>
			</nav>
	);
};

export default Navbar;
