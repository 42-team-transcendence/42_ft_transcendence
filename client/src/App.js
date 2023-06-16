import Register from './components/register/Register';
import Login from './components/login/Login';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import RequireAuth from './components/RequireAuth';

function App() {

  return (
    <main className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          </Route>

        {/* <Route element={<RequireAuth />}> */}
        {/* </Route> */}
      </Routes>
    </main>
  );
}

export default App;