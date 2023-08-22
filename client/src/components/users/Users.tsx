import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import axios, { CancelTokenSource } from 'axios';
import Miniature from "../miniature/Miniature";

import tchoupi from '../../assets/tchoupi50x50.jpg'
import { Box } from "@mui/material";
import { MiniatureUser } from "../../utils/types";

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

  return (
    <article style={{marginBottom:"90px"}}>
      <h2>Users List</h2>
      {users.length ? (
        <ul style={{display: "flex", flexDirection:'column'}}>
          {users.map((user, i) => {
            const miniatureUser: MiniatureUser = {
              nickname: user?.nickname,
              id: user?.id,
              minAvatar: {url: tchoupi, name:'Tchoupi'}
            }
						return (
              <Box key={i} sx={{backgroundColor:'gray'}}>
                <Miniature miniatureUser={miniatureUser} ></Miniature>
              </Box>
            )})}
        </ul>
      ) : (
        <p>No users to display</p>
      )}
    </article>
  );
}

export default Users;
