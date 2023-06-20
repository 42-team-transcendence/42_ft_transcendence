import Register from './signup/Register';
import Login from './signin/Login';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import '../styles/App.css';
import RequireAuth from './RequireAuth';
import Homepage from './homepage/HomePage';

function App() {

  return (
    <main className="App">
      <Routes>

        <Route path="/" element={<Layout />}>
          <Route element= {<RequireAuth />}>
            <Route path="/" element={<Homepage />} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
				</Route>
        
      </Routes>
    </main>
  );
}

export default App;