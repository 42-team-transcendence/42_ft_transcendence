// import axios from 'axios';

// const BASE_URL = 'http://localhost:3333'

// //on exporte cette variable pour l'avoir dans tout notre projet
// export default axios.create({
//     baseURL: BASE_URL
// });

// export const axiosPrivate = axios.create({
//     baseURL: BASE_URL,
// 	headers: {'Content-Type': 'application/json'},
// 	withCredentials: true
// });

import axios, { AxiosInstance } from 'axios';

const BASE_URL = 'http://localhost:3333';

// On exporte cette variable pour l'avoir dans tout notre projet
const instance: AxiosInstance = axios.create({
  baseURL: BASE_URL
});

const axiosPrivate: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

export default instance;
export { axiosPrivate };
