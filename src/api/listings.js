import axios from 'axios';

const api = axios.create({
  baseURL: '/listings',
  responseType: 'json',
  timeout: 10000,
  contentType: 'application/json',
});

const getAllListings = () => api
  .get(
    '/getAllListings',
  );

const acceptOffer = data => api
  .post(
    '/acceptOffer',
    { ...data },
    { headers: { 'x-auth': localStorage.getItem('auth') } },
  );

const delist = data => api
  .post(
    '/delist',
    { ...data },
    { headers: { 'x-auth': localStorage.getItem('auth') } },
  );

export default {
  getAllListings,
  acceptOffer,
  delist,
};
