/* eslint-disable react/jsx-one-expression-per-line */
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
import sellerApi from '../../../api/seller';
import ErrorDialog from '../../../commons/ErrorDialog';
import SuccessDialog from '../../../commons/SuccessDialog';
import { SET_ASSETS } from '../../../reducers/userAssetsReducer';

class CreateDeedDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { userAssets, deeds } = nextProps;
    const { goldOwned } = userAssets;
    const goldA = goldOwned === undefined ? {} : goldOwned.filter(g => g.goldId === deeds.gId)[0];
    const gold = goldA === undefined ? {} : goldA;
    this.setState({
      amount: gold.goldWeight === undefined ? 0 : gold.goldWeight - gold.weightListed,
    });
  }

  render() {
    const {
      classes, dispatch, deeds, userAssets,
    } = this.props;
    const { goldOwned } = userAssets;
    const goldA = goldOwned === undefined ? {} : goldOwned.filter(g => g.goldId === deeds.gId)[0];
    const gold = goldA === undefined ? {} : goldA;
    const { amount } = this.state;
    // const handleChange = (e, f) => {
    //   this.setState({ [e.target.name]: e.target.value === '' ? 0 : e.target.value });
    //   if (f !== undefined) f();
    // };
    const handleChangeAmt = (e, max) => {
      this.setState({ [e.target.name]: Math.min(max, e.target.value === '' ? 0 : e.target.value) });
    };
    const createDeed = () => {
      const { amount: w } = this.state;
      sellerApi.createDeedCa({
        weight: w,
        state: 'NOT_LISTED',
        caId: localStorage.getItem('username'),
        goldId: gold.goldId,
        // description,
      }).then(() => {
        sellerApi.getAllAssets().then((res) => {
          this.setState({ ...res.data }, () => dispatch({
            type: SET_ASSETS,
            assets: { ...res.data },
          }));
          SuccessDialog('Deed Listed Successfully', 'Deed', 'Created', '/', () => dispatch({
            type: CLOSE_CREATE_DEED_DIALOG,
            gId: -1,
          }));
        }).catch(e => console.log(e));
      })
        .catch(e => new ErrorDialog('creating deed', e));
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
                value={gold.goldWeight === undefined ? '0' : gold.goldWeight - gold.weightListed}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                className={classes.textField}
                type="String"
                label="Purity"
                value={gold.goldPurity === undefined ? '0' : gold.goldPurity}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              {gold.miner !== undefined && gold.miner !== null && gold.miner.startsWith('resource:org.acme.goldchain.Miner') && (
                <TextField
                  className={classes.textField}
                  type="String"
                  label="Miner"
                  value={gold.miner.split('#')[1]}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              )}
              {gold.miner !== undefined && gold.miner !== null && gold.miner.startsWith('resource:org.acme.goldchain.Miner') && (
                <TextField
                  className={classes.textField}
                  variant="outlined"
                  type="Number"
                  label="Deed's Amount (g)"
                  name="amount"
                  value={amount}
                  onChange={e => handleChangeAmt(e, gold.goldWeight - gold.weightListed)}
                  fullWidth
                />
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={createDeed}
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

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(CreateDeedDialog);
