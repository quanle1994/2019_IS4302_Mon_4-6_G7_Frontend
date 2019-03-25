import axios from 'axios';

const api = axios.create({
  baseURL: '/user',
  responseType: 'json',
  timeout: 10000,
  contentType: 'application/json',
});

const getAllAssets = () => api
  .get(
    '/getAllAssets',
    { headers: { 'x-auth': localStorage.getItem('auth') } },
  );

const createProduct = product => api
  .post(
    'createProduct',
    { ...product },
    { headers: { Authorisation: localStorage.getItem('token') } },
  );

const getOrders = sellerId => api
  .get(
    'getOrders',
    { params: { sellerId }, headers: { Authorisation: localStorage.getItem('token') } },
  );

const updateProduct = product => api
  .post(
    'updateProduct',
    { ...product },
    { headers: { Authorisation: localStorage.getItem('token') } },
  );

const getMyProducts = sellerId => api
  .get(
    'getMyProducts',
    { params: { sellerId }, headers: { Authorisation: localStorage.getItem('token') } },
  );

const setShipped = cId => api
  .get(
    'setShipped',
    { params: { cId }, headers: { Authorisation: localStorage.getItem('token') } },
  );

const deleteProduct = (sellerId, pId) => api
  .get(
    'deleteProduct',
    { params: { sellerId, pId }, headers: { Authorisation: localStorage.getItem('token') } },
  );

export default {
  createProduct,
  getOrders,
  updateProduct,
  getMyProducts,
  setShipped,
  deleteProduct,
  getAllAssets,
};
