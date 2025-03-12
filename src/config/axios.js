import axios from 'axios';

const baseAPI = axios.create({
   baseURL: `${process.env.REACT_APP_BASE_URL}`,
});

export { baseAPI };
