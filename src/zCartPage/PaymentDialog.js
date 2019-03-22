/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import Dialog from '@material-ui/core/Dialog/Dialog';
import Paper from '@material-ui/core/Paper/Paper';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import TextField from '@material-ui/core/TextField/TextField';
import Button from '@material-ui/core/Button/Button';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography/Typography';
import PaymenContainer from '../zPaymentComponent/PaymenContainer';
import history from '../history';
import ErrorDialog from '../commons/ErrorDialog';
import sellerApi from '../api/buyer';
import SuccessDialog from '../commons/SuccessDialog';
import { MODIFY_CART } from '../reducers/cartReducer';

export const CLOSE_PAYMENT_DIALOG = 'CLOSE_PAYMENT_DIALOG';
class PaymentDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullname: localStorage.getItem('fullname'),
      address: localStorage.getItem('address'),
      orderTotal: 0,
      remarks: '',
      token: null,
    };
  }

  componentWillMount() {
    const { cartItems, currentUser } = this.props;
    const orderTotal = Object.values(cartItems).map(obj => obj.product.price * obj.quantity).reduce((a, b) => a + b, 0);
    this.setState({
      address: currentUser.address,
      orderTotal: parseFloat(orderTotal).toFixed(2),
    });
  }

  componentWillReceiveProps(nextProps) {
    const { token, currentUser, cartItems } = nextProps;
    const orderTotal = Object.values(cartItems).map(obj => obj.product.price * obj.quantity).reduce((a, b) => a + b, 0);
    this.setState({
      fullname: localStorage.getItem('fullname'),
      address: currentUser.address,
      orderTotal: parseFloat(orderTotal).toFixed(2),
      token,
    });
  }

  handleClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: CLOSE_PAYMENT_DIALOG,
    });
    history.push('/cart');
  };

  handleCreateOrder = () => {
    const { dispatch, cartItems } = this.props;
    const { address, remarks, token } = this.state;
    const order = {
      buyerId: localStorage.getItem('id'),
      address,
      remarks,
      tokenReq: token,
      cartItemReqs: Object.values(cartItems).map(c => ({
        productId: c.product.id,
        quantity: c.quantity,
        subtotal: parseFloat(c.product.price * c.quantity).toFixed(2),
      })),
    };
    sellerApi.createOrder(order).then(() => {
      SuccessDialog('Create Order Successfully', 'Order', 'created', '/orders');
      setTimeout(() => {
        localStorage.setItem('cart', null);
        dispatch({
          type: CLOSE_PAYMENT_DIALOG,
        });
        dispatch({
          type: MODIFY_CART,
          cartItems: {},
        });
      }, 500);
    }).catch(error => ErrorDialog('creating order', error));
  };

  render() {
    const { classes, paymentDialogOpen } = this.props;
    const {
      fullname, address, orderTotal, remarks, token,
    } = this.state;
    const handleChange = e => this.setState({
      [e.target.name]: e.target.value,
    });
    return (
      <Dialog
        open={paymentDialogOpen}
        onClose={this.handleClose}
      >
        <Paper>
          <DialogTitle>Make Payment</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              className={classes.inputHalfLeft}
              label="Customer Name"
              name="fullname"
              type="text"
              value={fullname}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              className={classes.inputHalfRight}
              label="Order Total"
              type="number"
              name="orderTotal"
              InputProps={{ readOnly: true }}
              value={orderTotal}
              onChange={handleChange}
            />
            <TextField
              className={classes.input}
              fullWidth
              label="Shipping Address"
              name="address"
              type="text"
              value={address}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              className={classes.input}
              label="Remarks"
              name="remarks"
              type="text"
              value={remarks}
              onChange={handleChange}
            />
            <PaymenContainer />
          </DialogContent>
          <DialogActions>
            {token !== null && (
              <Button
                variant="contained"
                className={classNames([classes.button, classes.makePayment])}
                onClick={this.handleCreateOrder}
              >
                <Typography
                  variant="h6"
                  style={{
                    color: 'white',
                  }}
                >
                  Make Payment
                </Typography>
              </Button>
            )}
            <Button variant="outlined" className={classes.button} onClick={this.handleClose}>
              <Typography variant="h6">Cancel</Typography>
            </Button>
          </DialogActions>
        </Paper>
      </Dialog>
    );
  }
}

const style = () => ({
  container: {
    height: '100%',
    width: '100%',
  },
  input: {
    marginTop: 10,
  },
  inputHalfLeft: {
    marginTop: 10,
    width: '48%',
    marginRight: '2%',
    float: 'left',
  },
  inputHalfRight: {
    marginTop: 10,
    width: '48%',
    marginLeft: '2%',
    float: 'left',
  },
  button: {
    float: 'right',
    width: 250,
    height: 60,
  },
  makePayment: {
    backgroundColor: '#E84A5F',
    color: 'white',
  },
});

const mapStateToProps = state => ({
  currentUser: state.currentPage.currentUser,
  paymentDialogOpen: state.cart.paymentDialogOpen,
  cartItems: state.cart.cartItems,
  token: state.cart.token,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(PaymentDialog);
