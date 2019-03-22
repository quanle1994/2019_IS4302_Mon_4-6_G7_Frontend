import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import { Redirect, Route, Router } from 'react-router';
import SideBar from './SideBar';
import history from '../history';
import AdminPage from '../zAdminPage/AdminPage';
import ProductCarousel from './ProductComponents/ProductCarousel';
import { SET_CURRENT_USER } from '../zDrawer/SideDrawer';
import UserRegistration from '../zDrawer/UserActions/UserRegistration';
import ChangePasswordDialog from '../zDrawer/UserActions/ChangePasswordDialog';
import { MODIFY_CART } from '../reducers/cartReducer';
import CartPage from '../zCartPage/CartPage';
import PaymentDialog from '../zCartPage/PaymentDialog';
import OrderPage from '../zOrderPage/OrderPage';
import ProductViewer from './ProductComponents/ProductViewer';
import SellerProductsPage from '../zSellerProductsPage/SellerProductsPage';
import ProductEditDialog from '../zSellerProductsPage/ProductEditDialog';
import ProductCreateDialog from '../zSellerProductsPage/ProductCreateDialog';

class ProductsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const { dispatch } = this.props;
    if (localStorage.getItem('user') !== 'null' || localStorage.getItem('token') !== null) {
      dispatch({
        type: SET_CURRENT_USER,
        currentUser: JSON.parse(localStorage.getItem('user')),
      });
    }

    if (localStorage.getItem('cart') !== null) {
      dispatch({
        type: MODIFY_CART,
        cartItems: JSON.parse(localStorage.getItem('cart')),
      });
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <div className={classes.sidebar}>
          <SideBar />
        </div>
        <div className={classes.content}>
          <UserRegistration />
          <ChangePasswordDialog />
          <PaymentDialog />
          <ProductViewer />
          <ProductEditDialog />
          <ProductCreateDialog />
          <Router history={history}>
            <div>
              <Route
                exact
                path="/admin"
                render={() => (
                  localStorage.getItem('type') === 'ADMIN'
                    ? <AdminPage />
                    : <Redirect to={{ pathname: '/' }} />
                  // : <Redirect to={{ pathname: '/' }} />
                )}
              />
              <Route
                exact
                path="/register"
                render={() => (
                  localStorage.getItem('token') !== null ? <Redirect to={{ pathname: '/' }} /> : <ProductCarousel register />
                )}
              />
              <Route
                exact
                path="/cart"
                render={() => (
                  localStorage.getItem('type') !== 'BUYER' ? <Redirect to={{ pathname: '/' }} /> : <CartPage />
                )}
              />
              <Route
                exact
                path="/payment"
                render={() => (
                  localStorage.getItem('type') !== 'BUYER' ? <Redirect to={{ pathname: '/' }} /> : <CartPage payment />
                )}
              />
              <Route
                exact
                path="/products"
                render={() => (
                  localStorage.getItem('type') !== 'SELLER' ? <Redirect to={{ pathname: '/' }} /> : <SellerProductsPage />
                )}
              />
              <Route
                exact
                path="/products/create"
                render={({ match }) => (
                  localStorage.getItem('type') !== 'SELLER' ? <Redirect to={{ pathname: '/' }} />
                    : <SellerProductsPage create match={match} />
                )}
              />
              <Route
                exact
                path="/products/edit/:pId"
                render={({ match }) => (
                  localStorage.getItem('type') !== 'SELLER' ? <Redirect to={{ pathname: '/' }} />
                    : <SellerProductsPage edit match={match} />
                )}
              />
              <Route
                exact
                path="/orders"
                render={() => (
                  localStorage.getItem('token') === null ? <Redirect to={{ pathname: '/' }} /> : <OrderPage />
                )}
              />
              <Route exact path="/" component={ProductCarousel} />
              <Route path="/view/:pId" component={ProductCarousel} />
              <Route path="/feedback/:pId/:cId" render={({ match }) => <ProductCarousel feedback match={match} />} />
            </div>
          </Router>
        </div>
      </div>
    );
  }
}

const style = () => ({
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  sidebar: {
    height: '100%',
    width: '22vw',
  },
  content: {
    flex: 1,
    height: '100%',
    overflowY: 'auto',
    padding: 20,
    boxSizing: 'border-box',
  },
  full: {
    heigth: '100%',
  },
});

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(ProductsPage);
