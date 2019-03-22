import axios from 'axios';
import BACKEND_SERVER from './constants';

const BASE_URL = `${BACKEND_SERVER}/auth/Admin`;

const api = axios.create({
  baseURL: BASE_URL,
  responseType: 'json',
  timeout: 10000,
  contentType: 'application/json',
});

const getAllUsers = () => api
  .get(
    '/getAllUsers',
    { headers: { Authorisation: localStorage.getItem('token') } },
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
