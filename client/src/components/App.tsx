import Register from './signup/Register';
import Login from './signin/Login';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import '../styles/App.css';
import RequireAuth from './RequireAuth';
import Homepage from './homepage/HomePage';
import Leaderboard from './leaderboard/Leaderboard';
import PersistLogin from './PersistLogin';
import Callback42 from './0Auth42/Callback42';
import Chat from './chat/Chat';
import Rules from './Play/Rules';
import Play from './Play/Play'
import Profile from './profile/Profile';
import FriendList from './friends/FriendList';

function App() {
//Contient toutes les URLS / Routes de notre app front.
  return (
    <main className="App">
      <Routes>
        <Route path="/" element={<Layout />}>

          {/* Public routes */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="callback42" element={<Callback42 />} />

          {/* Routes protégées avec JWT */}
          <Route element={<PersistLogin />}>
            <Route element= {<RequireAuth />}>
              <Route path="/" element={<Homepage />} />
			        <Route path="play" element={<Play />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="rules" element={<Rules />} />
              <Route path="profile" element={<Profile />} />
              <Route path="friendlist" element={<FriendList />} />
              <Route path="chat" element={<Chat />} />
            </Route>
          </Route>
        
        </Route>
      </Routes>
    </main>
  );
}

export default App;