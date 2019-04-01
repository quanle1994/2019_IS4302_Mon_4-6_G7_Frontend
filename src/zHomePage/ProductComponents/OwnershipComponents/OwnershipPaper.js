/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import { Paper, TextField, Typography } from '@material-ui/core';
import sellerApi from '../../../api/seller';
import convert from '../../../commons/NumberConverter';
import GoldTable from './GoldTable';
import DeedsTable from './DeedsTable';
import { SET_ASSETS } from '../../../reducers/userAssetsReducer';
import { OPEN_MONEY_TOPUP } from '../../../reducers/currentPageReducer';

class OwnershipPaper extends React.Component {
  componentWillMount() {
    const { dispatch } = this.props;
    sellerApi.getAllAssets().then((res) => {
      this.setState({ ...res.data }, () => dispatch({
        type: SET_ASSETS,
        assets: { ...res.data },
      }));
    }).catch(e => console.log(e));
  }

  render() {
    const {
      classes, cartItems, userAssets, dispatch,
    } = this.props;
    const { goldOwned, deedOwned, money } = userAssets;
    const avail = Object.values(cartItems).filter(o => o.status === 'PENDING').reduce((a, b) => a + b.offerPrice, 0);
    return (
      <Paper className={classes.ownership}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
          <Typography
            className={classes.assets}
            variant="h4"
            style={{ paddingRight: 30, color: '#E84A5F' }}
            onClick={() => dispatch({
              type: OPEN_MONEY_TOPUP,
            })}
          >Your Assets
          </Typography>
          {(money !== undefined && !isNaN(money)) && localStorage.getItem('type') === 'RegisteredUser' && (
          <TextField
            type="String"
            style={{
              width: 200,
            }}
            value={`${convert(money)} / ${convert(money - avail)}`}
            label="Money Bal. / Available Bal."
            InputLabelProps={{ readOnly: true }}
          />
          )}
        </div>
        <div className={classes.section}>
          <GoldTable golds={goldOwned} deeds={deedOwned} />
        </div>
        {localStorage.getItem('type') !== 'Miner' && (
          <div className={classes.section}>
            <DeedsTable deeds={deedOwned} />
          </div>
        )}
      </Paper>
    );
  }
}

const style = () => ({
  ownership: {
    marginLeft: 10,
    width: '32vw',
    padding: 10,
    overflowY: 'auto',
  },
  section: {
    width: '100%',
    height: '47%',
    paddingTop: 10,
  },
  assets: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
});

const mapStateToProps = state => ({
  userAssets: state.userAssets,
  cartItems: state.cart.cartItems,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(OwnershipPaper);
