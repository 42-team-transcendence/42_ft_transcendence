import axios from 'axios';

//on exporte cette variable pour l'avoir dans tout notre projet
export default axios.create({
    baseURL : 'http://localhost:3500'
});