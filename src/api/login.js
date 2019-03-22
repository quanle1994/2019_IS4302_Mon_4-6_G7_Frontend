import axios from 'axios';
import BACKEND_SERVER from './constants';

const BASE_URL = `${BACKEND_SERVER}/auth`;

const api = axios.create({
  baseURL: BASE_URL,
  responseType: 'json',
  timeout: 10000,
  contentType: 'application/json',
});

const login = (username, password) => api
  .get(
    '/login',
    { params: { username, password }, headers: { Authorisation: localStorage.getItem('token') } },
  );

const register = user => api
  .post(
    'register',
    { ...user },
    { headers: { Authorisation: localStorage.getItem('token') } },
  );

const updateUser = user => api
  .post(
    'updateUser',
    { ...user },
    { headers: { Authorisation: localStorage.getItem('token') } },
  );

const changePassword = req => api
  .post(
    'changePassword',
    { ...req },
    { headers: { Authorisation: localStorage.getItem('token') } },
  );

export default {
  login,
  register,
  changePassword,
  updateUser
};
