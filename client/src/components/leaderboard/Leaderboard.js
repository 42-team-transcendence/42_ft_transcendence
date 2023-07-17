import Users from '../users/Users'
import Logout from '../logout/Logout'
import {Box} from '@mui/material'

function Leaderboard() {
  return (
	<Box >
		<h1>Leaderboard</h1>
		<Users />
		<Logout />
	</Box>
  )
}

export default Leaderboard