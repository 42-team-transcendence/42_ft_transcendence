import Users from '../users/Users'
import PageWrapper from '../navbar/pageWrapper'
import Logout from '../logout/Logout'
import {Box} from '@mui/material'

function Leaderboard() {
  return (
	<PageWrapper>
		<Box >
			<h1>Leaderboard</h1>
			<Users />
			<Logout />
		</Box>
	</PageWrapper>
  )
}

export default Leaderboard