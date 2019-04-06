import axios from 'axios';

const api = axios.create({
  baseURL: '/admin',
  responseType: 'json',
  timeout: 10000,
  contentType: 'application/json',
});

const getAllUsers = () => api
  .get(
    '/getAllUsers',
    { headers: { 'x-auth': localStorage.getItem('auth') } },
  );

const toggleActivity = data => api
  .post(
    '/setStatus',
    { ...data },
    { headers: { 'x-auth': localStorage.getItem('auth') } },
  );

export default {
  getAllUsers,
  toggleActivity,
};
