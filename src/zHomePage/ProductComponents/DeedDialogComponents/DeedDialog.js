import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import {
  Button, Dialog, DialogActions, TextField, Typography,
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { CLOSE_CREATE_DEED_DIALOG } from '../../../reducers/deedsReducer';
import history from '../../../history';
import convert from '../../../commons/DollarConverter';

class DeedDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      price: 0,
    };
  }

  render() {
    const {
      classes, dispatch, deeds, userAssets,
    } = this.props;
    const { golds } = userAssets;
    const goldA = golds === undefined || golds.balance === undefined ? {} : golds.balance.filter(g => g.id === deeds.gId)[0];
    const gold = goldA === undefined ? {} : goldA;
    const { amount, price } = this.state;
    const handleChange = (e, f) => {
      this.setState({ [e.target.name]: e.target.value === '' ? 0 : e.target.value });
      if (f !== undefined) f();
    };
    return (
      <Dialog
        open={deeds.createDeedOpen}
        fullWidth
        maxWidth="sm"
      >
        <Paper>
          <DialogTitle>Create Deed From Physical Gold</DialogTitle>
          <DialogContent>
            <div className={classes.container}>
              <TextField
                className={classes.textField}
                type="String"
                label="Available Amount"
                value={gold.weight === undefined ? '0' : gold.weight}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                className={classes.textField}
                type="String"
                label="Purity"
                value={gold.purity === undefined ? '0' : gold.purity}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                className={classes.textField}
                type="String"
                label="Cost"
                value={gold.cost === undefined ? '0' : convert(gold.cost)}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                className={classes.textField}
                variant="outlined"
                type="String"
                label="Deed's Amount (g)"
                name="amount"
                value={amount}
                onChange={e => handleChange(e, () => e.target.value <= gold.weight)}
                fullWidth
              />
              <TextField
                className={classes.textField}
                variant="outlined"
                type="String"
                label="Deed's Unit Price"
                name="price"
                onChange={handleChange}
                value={price}
                fullWidth
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                dispatch({
                  type: CLOSE_CREATE_DEED_DIALOG,
                });
                history.push('/');
              }}
            >Create Deed
            </Button>
            <Button
              // variant="outlined"
              onClick={() => {
                this.setState({
                  amount: 0,
                  price: 0,
                }, () => dispatch({
                  type: CLOSE_CREATE_DEED_DIALOG,
                  gId: -1,
                }));
                history.push('/');
              }}
            >close
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
    width: '70%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  textField: {
    textAlign: 'center',
    marginTop: 20,
  },
});

const mapStateToProps = state => ({
  deeds: state.deeds,
  userAssets: state.userAssets,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(DeedDialog);
