import axios from 'axios';
import BACKEND_SERVER from './constants';

const BASE_URL = `${BACKEND_SERVER}/auth/Buyer`;

const api = axios.create({
  baseURL: BASE_URL,
  responseType: 'json',
  timeout: 10000,
  contentType: 'application/json',
});

const createOrder = order => api
  .post(
    'createOrder',
    { ...order },
    { headers: { Authorisation: localStorage.getItem('token') } },
  );

const getOrders = buyerId => api
  .get(
    'getOrders',
    { params: { buyerId }, headers: { Authorisation: localStorage.getItem('token') } },
  );

const sendFeedback = feedback => api
  .post(
    'sendFeedback',
    { ...feedback },
    { headers: { Authorisation: localStorage.getItem('token') } },
  );

const checkCanFeedback = (buyerId, productId) => api
  .get(
    'checkCanFeedback',
    { params: { buyerId, productId }, headers: { Authorisation: localStorage.getItem('token') } },
  );

const setDelivered = cId => api
  .get(
    'setDelivered',
    { params: { cId }, headers: { Authorisation: localStorage.getItem('token') } },
  );

const logout = (buyerId, cartString) => api
  .get(
    'logout',
    { params: { buyerId, cartString }, headers: { Authorisation: localStorage.getItem('token') } },
  );
export default {
  createOrder,
  getOrders,
  sendFeedback,
  checkCanFeedback,
  setDelivered,
  logout,
};
