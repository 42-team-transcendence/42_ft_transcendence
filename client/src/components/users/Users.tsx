import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import axios, { CancelTokenSource } from 'axios';
import Miniature from "../miniature/Miniature";

import tchoupi from '../../assets/tchoupi50x50.jpg'

interface User {
  nickname: string;
  id: number
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

	const goToUserProfile = (user:User) => {
		navigate(`/profile/${user.id}`, {replace: false});
	}

  return (
    <article style={{marginBottom:"90px"}}>
      <h2>Users List</h2>
      {users.length ? (
        <ul style={{display: "flex", flexDirection:'column'}}>
          {users.map((user, i) => {
						return (
              <button key={i}
                onClick={() => goToUserProfile(user)}
              ><Miniature nickname={user?.nickname} minAvatar={{url: tchoupi, name:'Tchoupi'}}></Miniature>
              </button>
            )})}
        </ul>
      ) : (
        <p>No users to display</p>
      )}
    </article>
  );
}

export default Users;
