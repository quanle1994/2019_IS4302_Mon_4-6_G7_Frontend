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
    '/register',
    { ...user },
    { headers: { 'x-auth': localStorage.getItem('auth') } },
  );

const updateUser = user => api
  .post(
    '/updateDetails',
    { ...user },
    { headers: { 'x-auth': localStorage.getItem('auth') } },
  );

const changePassword = req => api
  .post(
    '/updatePassword',
    { ...req },
    { headers: { 'x-auth': localStorage.getItem('auth') } },
  );

export default {
  login,
  register,
  changePassword,
  updateUser,
};
