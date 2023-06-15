import Register from './components/signup/Register';
import Login from './components/signin/Login';
import { Routes, Route } from "react-router-dom"
import Layout from "./Layout"
import RequireAuth from './components/RequireAuth';
import Homepage from './components/homepage/homepage';

function App() {

  return (
    <main className="App">

		<Routes>
			<Route path="/" element={<Layout />}>
				<Route path="login" element={<Login />}/>
				<Route path="register" element={<Register />}/>
				
				<Route element= {<RequireAuth />}>
					<Route path="homepage" element={<Homepage />}/>
				</Route>
				{/* <Route path="*" element={<Missing />}/> */}
			
			</Route>
		</Routes>
    </main>
  );
}

export default App; 