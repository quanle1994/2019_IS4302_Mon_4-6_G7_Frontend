import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.css';
// import productApi from './api/product';

store.subscribe(() => {
  console.log(store.getState());
});

// window.onbeforeunload = () => {
//   const cart = localStorage.getItem('cart');
//   const cartItems = JSON.parse(cart);
//   const c = Object.values(cartItems).map(obj => ({
//     productId: obj.product.id,
//     quantity: obj.quantity,
//     addTime: obj.addTime,
//   }));
//   listingsApi.updateCart(localStorage.getItem('id'), c);
//   localStorage.clear();
// };

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
