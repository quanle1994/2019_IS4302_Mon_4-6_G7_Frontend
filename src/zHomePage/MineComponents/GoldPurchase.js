/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import sellerApi from '../../api/buyer';
import ErrorDialog from '../../commons/ErrorDialog';
import SuccessDialog from '../../commons/SuccessDialog';

class GoldPurchase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
    };
  }

  handleAmountChange = (e, max) => {
    this.setState({
      [e.target.name]: Math.min(e.target.value, max),
    });
  };

  handleOrderGold = () => {
    const { amount } = this.state;
    const { dispatch, miner, gold } = this.props;
    sellerApi.buyGoldRequest({
      gold: gold.goldId,
      minerId: miner.userId,
      goldWeight: amount,
    }).then(
      () => SuccessDialog('Placed Gold Purchase Order Successfully', 'Gold order', 'lodged'),
    ).catch(e => ErrorDialog('placing gold purchase order', e));
  };

  render() {
    const {
      classes, gold
    } = this.props;
    const { amount } = this.state;
    return (
      <div className={classes.container}>
        <TextField
          type="number"
          label={`Gold ${gold.goldPurity} - ${gold.goldWeight} g`}
          variant="outlined"
          value={amount}
          name="amount"
          onChange={e => this.handleAmountChange(e, gold.goldWeight)}
        />
        <Button variant="outlined" color="primary" className={classes.button} onClick={this.handleOrderGold}>
          Place Order
        </Button>
      </div>
    );
  }
}

const style = () => ({
  container: {
    marginTop: 10,
    textAlign: 'center',
  },
  button: {
    marginTop: 10,
  },
});

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(GoldPurchase);
