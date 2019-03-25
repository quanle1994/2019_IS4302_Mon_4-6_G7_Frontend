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

const toggleActivity = (id) => api
  .get(
    '/toggleActivity',
    { params: { id }, headers: { Authorisation: localStorage.getItem('token') } },
  );

export default {
  getAllUsers,
  toggleActivity,
};
