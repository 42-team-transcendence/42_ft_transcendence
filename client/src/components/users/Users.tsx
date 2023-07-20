// import { useState, useEffect } from "react"
// import useAxiosPrivate from "../../hooks/useAxiosPrivate";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from '../../api/axios';
// import Logout from "../logout/Logout";

// /*
// A propos de AbortController et controller.signal
// To enable request cancellation, an AbortController object is created using the new AbortController() constructor. This AbortController instance provides a signal property, which represents a signal that can be used to communicate with the ongoing request.

// By passing controller.signal as the signal parameter in the axiosPrivate.get() method, it associates the AbortController's signal with the HTTP request. This allows for potential cancellation of the request in case the component is unmounted before the request completes.

// Cleanup function (dans le return du UseEffect)
// in the cleanup function, controller.abort() is called to signal the cancellation of the request. When the cleanup function is executed (when the component is unmounted), it calls the abort() method on the controller object, which effectively cancels the ongoing HTTP request associated
// */

// function Users() {
// 	const [users, setUsers] = useState();
// 	const axiosPrivate = useAxiosPrivate();
// 	const navigate = useNavigate();
// 	const location = useLocation();


// 	useEffect(() => {
// 		let isMounted = true;
// 		const controller = new AbortController();

// 		const getUsers = async () => {
// 			try {
// 				const response = await axiosPrivate.get('/users', {
// 				signal: controller.signal
// 				});
// 				console.log(response.data);
// 				isMounted && setUsers(response.data);
// 			} catch (error) {
// 				console.log(error);
// 				navigate('/register', { state: {from: location}, replace: true});
// 			}
// 		}
// 		getUsers();

// 		return () => {
// 			isMounted = false;
// 			// controller.abort();
// 		}
		
// 	}, [])

//   return (
// 	<article>
// 		<h2>
// 			Users List
// 		</h2>
// 		{ users?.length
// 			? (
// 				<ul>
// 					{users.map((user, i) => <li key={i}>{user?.nickname}</li>)}
// 				</ul>
// 			): <p> No users to display</p>
// 		}
// 		<Logout />
// 		{/* <button onClick={() => refresh()}>Refresh</button> */}
// 	</article>
//   );
// };

// export default Users

import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import axios, { CancelTokenSource } from 'axios';
import Logout from "../logout/Logout";

interface User {
  nickname: string;
  // Autres propriétés de l'utilisateur si nécessaire
}

function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    let cancelTokenSource: CancelTokenSource;

    const getUsers = async () => {
      try {
        cancelTokenSource = axios.CancelToken.source();

        const response = await axiosPrivate.get<User[]>('/users', {
          cancelToken: cancelTokenSource.token
        });

        console.log(response.data);
        if (isMounted) {
          setUsers(response.data);
        }
      } catch (error) {
        console.log(error);
        navigate('/register', { state: { from: location }, replace: true });
      }
    };

    getUsers();

    return () => {
      isMounted = false;
      if (cancelTokenSource) {
        cancelTokenSource.cancel();
      }
    };
  }, [axiosPrivate, navigate, location]);

  return (
    <article>
      <h2>Users List</h2>
      {users.length ? (
        <ul>
          {users.map((user, i) => (
            <li key={i}>{user?.nickname}</li>
          ))}
        </ul>
      ) : (
        <p>No users to display</p>
      )}
      <Logout />
      {/* <button onClick={() => refresh()}>Refresh</button> */}
    </article>
  );
}

export default Users;
