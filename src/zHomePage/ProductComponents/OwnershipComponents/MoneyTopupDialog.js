/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
} from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import { CLOSE_MONEY_TOPUP } from '../../../reducers/currentPageReducer';
import convert from '../../../commons/NumberConverter';
import buyerApi from '../../../api/buyer';
import ErrorDialog from '../../../commons/ErrorDialog';
import sellerApi from '../../../api/seller';
import { SET_ASSETS } from '../../../reducers/userAssetsReducer';
import SuccessDialog from '../../../commons/SuccessDialog';

class MoneyTopupDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      weight: 0,
      purity: 0,
      price: 0,
      regUser: '',
      isCash: 1,
    };
  }

  handleTopup = () => {
    const { amount, isCash } = this.state;
    const { dispatch } = this.props;
    const type = localStorage.getItem('type');

    if (type === 'RegisteredUser') {
      buyerApi.topupRequest({ amount }).then(() => {
        sellerApi.getAllAssets().then((res) => {
          SuccessDialog('Updated Cash Successfully', 'Cash balance', 'topped up', null,
            () => dispatch({
              type: CLOSE_MONEY_TOPUP,
            }));
          this.setState({ ...res.data }, () => dispatch({
            type: SET_ASSETS,
            assets: { ...res.data },
          }));
        }).catch(e => console.log(e));
      }).catch(e => ErrorDialog('updating cash', e));
    } else if (type === 'CertificateAuthority' && isCash) {
      buyerApi.topupRequestCa({ amount }).then(() => {
        sellerApi.getAllAssets().then((res) => {
          SuccessDialog('Updated Cash Successfully', 'Cash balance', 'topped up', null,
            () => dispatch({
              type: CLOSE_MONEY_TOPUP,
            }));
          this.setState({ ...res.data }, () => dispatch({
            type: SET_ASSETS,
            assets: { ...res.data },
          }));
        }).catch(e => console.log(e));
      }).catch(e => ErrorDialog('updating cash', e));
    } else if (type === 'CertificateAuthority') {
      const {
        weight, purity, regUser, price,
      } = this.state;
      sellerApi.convertGoldToDeed({
        weight,
        ca: localStorage.getItem('username'),
        purity,
        regUser,
        price,
      }).then(() => {
        SuccessDialog('Convert Gold Successfully', 'Gold', 'converted to deed', '',
          () => dispatch({
            type: CLOSE_MONEY_TOPUP,
          }));
        sellerApi.getAllAssets().then(res => this.setState({ ...res.data },
          () => dispatch({
            type: SET_ASSETS,
            assets: { ...res.data },
          }))).catch(e => console.log(e));
      }).catch(e => ErrorDialog('converting gold to deed', e));
    } else if (type === 'Miner') {
      const { weight, purity, price } = this.state;
      sellerApi.topupGold({ weight, purity, price }).then(() => {
        sellerApi.getAllAssets().then(res => this.setState({ ...res.data },
          () => dispatch({
            type: SET_ASSETS,
            assets: { ...res.data },
          }))).catch(e => console.log(e));
        SuccessDialog('Top up Gold Successfully', 'Gold', 'added to your assets', '',
          () => dispatch({
            type: CLOSE_MONEY_TOPUP,
          }));
      }).catch(e => ErrorDialog('topping up gold', e));
    }
  };

  render() {
    const {
      classes, dispatch, moneyTopup, userAssets, cartItems,
    } = this.props;
    const {
      amount, weight, purity, regUser, price, isCash,
    } = this.state;
    const handleChange = e => this.setState({
      [e.target.name]: e.target.value,
    });
    const { money: m } = userAssets;
    const money = parseFloat(m);
    const avail = parseFloat(Object.values(cartItems).filter(o => o.status === 'PENDING').reduce((a, b) => a + b.offerPrice, 0));
    const type = localStorage.getItem('type');
    const title = type === 'Miner' ? 'Gold Balance Topup' : type === 'CertificateAuthority' ? "Create Deed From User's Gold" : 'Money Balance Topup';
    return (
      <Dialog
        open={moneyTopup}
        maxWidth="sm"
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {type === 'CertificateAuthority' && (
            <TextField
              name="isCash"
              select
              value={isCash}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value={1} label="Cash Top Up">Cash Top Up</MenuItem>
              <MenuItem value={0} label="Gold Conversion To Deed">Gold Conversion To Deed</MenuItem>
            </TextField>
          )}
          {(type === 'RegisteredUser' || type === 'CertificateAuthority') && isCash === 1 && (
            <div>
              <TextField
                className={classes.marginTop}
                label="Money Balance / Available Balance"
                type="String"
                fullWidth
                value={`${convert(money)} / ${convert(money - avail)}`}
                InputProps={{ readOnly: true }}
              />
              <TextField
                className={classes.marginTop}
                label="New Balance"
                type="String"
                value={`${convert(money + parseFloat(amount))} / ${convert(money - avail + parseFloat(amount))}`}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                className={classes.marginTop}
                variant="outlined"
                label="Money Balance / Available Balance"
                type="Number"
                name="amount"
                value={amount}
                fullWidth
                onChange={handleChange}
              />
            </div>
          )}
          {type === 'CertificateAuthority' && !isCash && (
            <div>
              <TextField
                className={classes.marginTop}
                label="Certificate Authority"
                type="String"
                fullWidth
                value={localStorage.getItem('name')}
                InputProps={{ readOnly: true }}
              />
              <TextField
                className={classes.marginTop}
                variant="outlined"
                label="Gold Weight in Gram"
                type="Number"
                name="weight"
                value={weight}
                fullWidth
                onChange={handleChange}
              />
              <TextField
                className={classes.marginTop}
                variant="outlined"
                label="Purity"
                type="Number"
                name="purity"
                value={purity}
                fullWidth
                onChange={handleChange}
              />
              <TextField
                className={classes.marginTop}
                variant="outlined"
                label="Gold's Unit Price"
                type="Number"
                name="price"
                value={price}
                fullWidth
                onChange={handleChange}
              />
              <TextField
                className={classes.marginTop}
                variant="outlined"
                label="Registered User To Issue Deed"
                type="String"
                name="regUser"
                value={regUser}
                fullWidth
                onChange={handleChange}
              />
            </div>
          )}
          {type === 'Miner' && (
            <div>
              <TextField
                className={classes.marginTop}
                label="Miner"
                type="String"
                fullWidth
                value={localStorage.getItem('name')}
                InputProps={{ readOnly: true }}
              />
              <TextField
                className={classes.marginTop}
                variant="outlined"
                label="Gold Weight in Gram"
                type="Number"
                name="weight"
                value={weight}
                fullWidth
                onChange={handleChange}
              />
              <TextField
                className={classes.marginTop}
                variant="outlined"
                label="Purity"
                type="Number"
                name="purity"
                value={purity}
                fullWidth
                onChange={handleChange}
              />
              <TextField
                className={classes.marginTop}
                variant="outlined"
                label="Gold's Unit Price"
                type="Number"
                name="price"
                value={price}
                fullWidth
                onChange={handleChange}
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleTopup}
          >Top up
          </Button>
          <Button
            variant="outlined"
            onClick={() => dispatch({
              type: CLOSE_MONEY_TOPUP,
            })}
          >Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const style = () => ({
  container: {
    height: '100%',
    width: '100%',
  },
  marginTop: {
    marginTop: 20,
  },
});

const mapStateToProps = state => ({
  moneyTopup: state.currentPage.moneyTopup,
  userAssets: state.userAssets,
  cartItems: state.cart.cartItems,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(MoneyTopupDialog);
