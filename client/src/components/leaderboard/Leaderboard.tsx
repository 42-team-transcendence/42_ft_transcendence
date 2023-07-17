import React from 'react'
import Users from '../users/Users'
import PageWrapper from '../navbar/pageWrapper'

function Leaderboard() {
  return (
	<PageWrapper>
		<div>
			<h1>Leaderboard</h1>
			< Users />
		</div>
	</PageWrapper>	
  )
}

export default Leaderboard