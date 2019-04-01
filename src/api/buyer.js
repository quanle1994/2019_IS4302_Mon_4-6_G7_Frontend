import axios from 'axios';

const api = axios.create({
  baseURL: '/user',
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

const offer = data => api
  .post(
    '/offerRequest',
    { ...data },
    { headers: { 'x-auth': localStorage.getItem('auth') } },
  );

const getMyOffers = userId => api
  .get(
    `/getMyOffers${userId === undefined ? '' : `/${userId}`}`,
    { headers: { 'x-auth': localStorage.getItem('auth') } },
  );

const topupRequest = data => api
  .post(
    'increaseCash',
    { ...data },
    { headers: { 'x-auth': localStorage.getItem('auth') } },
  );

const buyGoldRequest = data => api
  .post(
    'buyGoldRequest',
    { ...data },
    { headers: { 'x-auth': localStorage.getItem('auth') } },
  );

export default {
  createOrder,
  getOrders,
  sendFeedback,
  checkCanFeedback,
  setDelivered,
  logout,
  offer,
  getMyOffers,
  topupRequest,
  buyGoldRequest,
};
