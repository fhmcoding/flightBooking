import axios from 'axios';

const axiosClient = axios.create();

axiosClient.defaults.baseURL = 'https://api.backend.elsahariano.com/api/v1';

axiosClient.defaults.headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
};

// axiosClient.defaults.timeout = 2000;

axiosClient.defaults.withCredentials = true;

export default axiosClient