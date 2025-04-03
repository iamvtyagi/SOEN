import axios from 'axios';


// console.log(import.meta.env.VITE_API_URL);
// console.log(localStorage.getItem('token'));
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
    }
})


export default axiosInstance;