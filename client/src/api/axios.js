import axios from 'axios';

const BASE_URL = 'http://localhost:3333'

//on exporte cette variable pour l'avoir dans tout notre projet
export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
	headers: {'Content-Type': 'application/json'},
	withCredentials: true
});