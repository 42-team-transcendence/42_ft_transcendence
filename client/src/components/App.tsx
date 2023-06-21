import Register from './signup/Register';
import Login from './signin/Login';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import '../styles/App.css';
import RequireAuth from './RequireAuth';
import Homepage from './homepage/HomePage';
import FirstPage from './homepage/FirstPage';
import Leaderboard from './leaderboard/Leaderboard';

function App() {

  return (
    <main className="App">
      <Routes>

        <Route path="/" element={<Layout />}>
          <Route element= {<RequireAuth />}>
            <Route path="/" element={<Homepage />} />
			<Route path="leaderboard" element={<Leaderboard />} />

          </Route>
        
			<Route path="login" element={<Login />} />
        	<Route path="register" element={<Register />} />
		</Route>
        
      </Routes>
    </main>
  );
}

export default App;