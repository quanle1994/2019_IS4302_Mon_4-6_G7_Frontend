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
import { getCASaleRequests } from '../../commons/RoutineUpdate';
import convert from '../../commons/NumberConverter';

class GoldPurchase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      isPending: false,
    };
  }

  componentWillMount() {
    const { goldRequests, gold } = this.props;
    const req = goldRequests.filter(g => g.gold.goldId === gold.goldId && g.verificationState === 'PENDING');
    if (req.length !== 0) this.setState({ amount: req[0].goldWeight, isPending: true });
  }

  componentWillReceiveProps(nextProps) {
    const { goldRequests, gold } = nextProps;
    const req = goldRequests.filter(g => g.gold.goldId === gold.goldId && g.verificationState === 'PENDING');
    if (req.length !== 0) this.setState({ amount: req[0].goldWeight, isPending: true });
  }

  handleAmountChange = (e, max) => {
    this.setState({
      [e.target.name]: Math.min(e.target.value, max),
    });
  };

  handleOrderGold = () => {
    const { amount } = this.state;
    const { miner, gold, dispatch } = this.props;
    sellerApi.buyGoldRequest({
      goldId: gold.goldId,
      minerId: miner.userId,
      goldWeight: amount,
    }).then(() => {
      getCASaleRequests(dispatch);
      SuccessDialog('Placed Gold Purchase Order Successfully', 'Gold order', 'lodged');
    }).catch(e => ErrorDialog('placing gold purchase order', e));
  };

  render() {
    const {
      classes, gold,
    } = this.props;
    const { amount, isPending } = this.state;
    return (
      <div className={classes.container}>
        <div className={classes.wrapper}>
          <TextField
            className={classes.textField}
            type="number"
            label={`Gold ${gold.goldPurity} - ${gold.goldWeight} g`}
            variant={isPending ? 'filled' : 'outlined'}
            value={amount}
            name="amount"
            InputProps={{ readOnly: isPending }}
            onChange={e => this.handleAmountChange(e, gold.goldWeight)}
          />
          <TextField
            className={classes.textField}
            type="string"
            label={`$ ${gold.price} / g):`}
            variant="filled"
            value={convert(gold.price * amount)}
            name="amount"
            InputProps={{ readOnly: true }}
          />
        </div>
        {!isPending && (
          <Button variant="outlined" color="primary" className={classes.button} onClick={this.handleOrderGold}>
            Place Order
          </Button>
        )}
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
    marginBottom: 5,
  },
  wrapper: {
    width: '100%',
  },
  textField: {
    width: '48%',
    marginRight: 5,
    boxSizing: 'border',
  },
});

const mapStateToProps = state => ({
  goldRequests: state.userAssets.goldRequests,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(GoldPurchase);
