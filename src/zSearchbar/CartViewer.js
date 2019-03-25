import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import MenuList from '@material-ui/core/MenuList/MenuList';
import Paper from '@material-ui/core/Paper/Paper';
import Button from '@material-ui/core/Button/Button';
import Typography from '@material-ui/core/Typography/Typography';
import ClickAwayListener from '@material-ui/core/ClickAwayListener/ClickAwayListener';
import Popover from '@material-ui/core/Popover/Popover';
import ListItem from '@material-ui/core/ListItem/ListItem';
import List from '@material-ui/core/List/List';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import { CLOSE_CART_VIEWER } from '../reducers/cartReducer';
import history from '../history';
import { SET_CURRENT_PAGE } from '../reducers/currentPageReducer';

class CartViewer extends React.Component {
  handleOnClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: CLOSE_CART_VIEWER,
      anchorEl: null,
    });
  };

  handleOpenCartPage = () => {
    const { dispatch } = this.props;
    history.push('/shopping_cart');
    dispatch({
      type: SET_CURRENT_PAGE,
      currentPage: 'shopping_cart',
    });
  };

  render() {
    const {
      classes, cartItems, cartViewerOpen, anchorEl,
    } = this.props;
    const number = Object.values(cartItems).map(obj => obj.product.price * obj.quantity).reduce((a, b) => a + b, 0);
    return (
      <Popover
        open={cartViewerOpen}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Paper className={classes.container}>
          <ClickAwayListener onClickAway={this.handleOnClose}>
            <MenuList className={classes.listWrapper}>
              <List component="nav">
                {Object.values(cartItems).map(obj => (
                  <ListItem button>
                    <ListItemText primary={obj.product.productName} className={classes.productName} />
                    <ListItemText primary={obj.quantity} className={classes.quantity} />
                    <ListItemText primary={parseFloat(obj.quantity * obj.product.price).toFixed(2)} className={classes.price} />
                  </ListItem>
                ))}
              </List>
            </MenuList>
            <div className={classes.bottom}>
              <Button variant="outlined" className={classes.button} onClick={this.handleOpenCartPage}>View Cart Page</Button>
              <div className={classes.floatRight}>
                <Typography variant="h6" className={classes.total}>
                  {parseFloat(number).toFixed(2)}
                </Typography>
                <Typography variant="h6" className={classes.totalText}>Total:&nbsp;</Typography>
              </div>
            </div>
          </ClickAwayListener>
        </Paper>
      </Popover>
    );
  }
}

const style = () => ({
  container: {
    height: 300,
    width: 400,
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
  },
  totalText: {
    float: 'right',
    color: '#E84A5F',
  },
  floatRight: {
    float: 'right',
  },
  total: {
    float: 'right',
    marginRight: 20,
    color: '#E84A5F',
  },
  bottom: {
    marginTop: 20,
  },
  listWrapper: {
    flex: 'auto',
    overflowY: 'scroll',
  },
  button: {
    color: 'teal',
    borderColor: 'teal',
  },
  productName: {
    width: '50%',
  },
  quantity: {
    width: '10%',
    textAlign: 'right',
  },
  price: {
    width: '40%',
    textAlign: 'right',
  },
});

const mapStateToProps = state => ({
  cartItems: state.cart.cartItems,
  cartViewerOpen: state.cart.cartViewerOpen,
  anchorEl: state.cart.anchorEl,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(CartViewer);
