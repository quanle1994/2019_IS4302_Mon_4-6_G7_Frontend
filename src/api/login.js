import axios from 'axios';

const api = axios.create({
  baseURL: '/user',
  responseType: 'json',
  timeout: 10000,
  contentType: 'application/json',
});

const login = (username, password) => api
  .post(
    '/signin',
    { username, password },
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
  updateUser,
};
