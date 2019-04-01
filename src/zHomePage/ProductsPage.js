import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import { Redirect, Route, Router } from 'react-router';
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
import MineCatalogue from './MineComponents/MineCatalogue';
import VerifiedSellers from './CertificateAuthoritiesComponents/CerticateAuthorities';
import CreateDeedDialog from './ProductComponents/DeedDialogComponents/CreateDeedDialog';
import ListDeedDialog from './ProductComponents/DeedDialogComponents/ListDeedDialog';
import OffersSummary from './OfferComponents/OffersSummary';
import MoneyTopupDialog from "./ProductComponents/OwnershipComponents/MoneyTopupDialog";

class ProductsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const { dispatch } = this.props;
    if (localStorage.getItem('user') !== 'null' || localStorage.getItem('auth') !== null) {
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
        <UserRegistration />
        <ChangePasswordDialog />
        <PaymentDialog />
        <ProductViewer />
        <CreateDeedDialog />
        <ListDeedDialog />
        <MoneyTopupDialog />
        <Router history={history}>
          <div style={{
            height: '100%', width: '100%', overflowX: 'auto', overflowY: 'auto',
          }}
          >
            <Route
              exact
              path="/join_requests"
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
              path="/orders"
              render={() => (
                localStorage.getItem('token') === null ? <Redirect to={{ pathname: '/' }} /> : <OrderPage />
              )}
            />
            <Route exact path="/" component={ProductCarousel} />
            <Route exact path="/create_deed/:gId" render={({ match }) => <ProductCarousel feedback match={match} />} />
            <Route exact path="/list_deed/:dId" render={({ match }) => <ProductCarousel feedback match={match} />} />
            <Route exact path="/browse_all_gold" component={ProductCarousel} />
            <Route exact path="/our_mines" component={MineCatalogue} />
            <Route exact path="/offers" component={OffersSummary} />
            <Route exact path="/certificate_authorities" component={VerifiedSellers} />
            <Route exact path="/shopping_cart" component={CartPage} />
            <Route path="/view/:pId" component={ProductCarousel} />
            <Route path="/feedback/:pId/:cId" render={({ match }) => <ProductCarousel feedback match={match} />} />
          </div>
        </Router>
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
  content: {
    flex: 1,
    height: '100%',
    overflowY: 'auto',
    padding: 10,
    boxSizing: 'border-box',
  },
  full: {
    heigth: '100%',
  },
});

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(ProductsPage);
