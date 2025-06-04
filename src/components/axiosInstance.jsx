import axios from 'axios';
const baseURL = 'https://api.shresthanish.com.np';

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});
export default axiosInstance;

