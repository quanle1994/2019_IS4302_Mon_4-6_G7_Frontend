/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import {
  Button, Dialog, DialogActions, MenuItem, TextField, Typography,
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { CLOSE_LIST_DEED_DIALOG } from '../../../reducers/deedsReducer';
import history from '../../../history';
import sellerApi from '../../../api/seller';
import ErrorDialog from '../../../commons/ErrorDialog';

class CreateDeedDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 0,
      price: 0,
      title: '',
      description: '',
      amount: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, deeds, userAssets } = nextProps;
    const { deedOwned } = userAssets;
    const deed = deedOwned === undefined ? {} : deedOwned.filter(d => d.deedId === deeds.dId)[0];
    if (deedOwned !== undefined && deed !== undefined && deed.listingState !== 'NOT_LISTED') {
      history.push('/');
      dispatch({
        type: CLOSE_LIST_DEED_DIALOG,
      });
    }
    if (deedOwned !== undefined && deed !== undefined && deed.listingState === 'NOT_LISTED') {
      this.setState({
        amount: deed.goldWeight,
      });
    }
  }

  render() {
    const {
      classes, dispatch, deeds, userAssets,
    } = this.props;
    const { deedOwned } = userAssets;
    const deed = deedOwned === undefined ? {} : deedOwned.filter(d => d.deedId === deeds.dId)[0];
    const gold = deed === undefined ? {} : deed.gold;
    const {
      type, price, title, description, amount,
    } = this.state;
    const handleChange = (e) => {
      this.setState({ [e.target.name]: e.target.value === '' ? 0 : e.target.value });
    };
    const handleChangeAmt = (e, max) => {
      this.setState({ [e.target.name]: Math.min(max, e.target.value === '' ? 0 : e.target.value) });
    };
    const listDeed = () => {
      const {
        price: p, title: t, description: d, amount: weightToList,
      } = this.state;
      if (t === '') {
        ErrorDialog('Invalid Input', { message: 'Title is empty' });
        return;
      }
      if (d === '') {
        ErrorDialog('Invalid Input', { message: 'Description is empty' });
        return;
      }
      if (p === 0) {
        ErrorDialog('Invalid Input', { message: 'Price cannot be 0' });
        return;
      }
      sellerApi.listDeedForSale({
        userId: localStorage.getItem('username'),
        title: t,
        price: p,
        deedId: deed.deedId,
        description: d,
        weightToList,
      }).then(() => {
        dispatch({
          type: CLOSE_LIST_DEED_DIALOG,
        });
        history.push('/');
      }).catch(e => new ErrorDialog('creating deed', e));
    };
    return deedOwned !== undefined && deed !== undefined && gold !== undefined && (
      <Dialog
        open={deeds.listDeedOpen}
        fullWidth
        maxWidth="sm"
      >
        <Paper>
          <DialogTitle>LIST DEED FOR SALE</DialogTitle>
          <DialogContent>
            <div className={classes.container}>
              <TextField
                select
                className={classes.textField}
                type="String"
                label="Type of Sale"
                name="type"
                value={type}
                fullWidth
                onChange={handleChange}
              >
                <MenuItem value={0}>1 TO 1 SALE</MenuItem>
                {/* <MenuItem value={1}>AUCTION</MenuItem> */}
              </TextField>
              <TextField
                className={classes.textField}
                variant="outlined"
                type="String"
                label="Deed's Title"
                name="title"
                onChange={handleChange}
                value={title}
                fullWidth
              />
              <TextField
                className={classes.textField}
                variant="outlined"
                type="String"
                label="Deed's Description"
                name="description"
                onChange={handleChange}
                value={description}
                fullWidth
              />
              <TextField
                className={classes.specialField}
                type="String"
                label="Gold Weight / g"
                value={deed.goldWeight === undefined ? '0' : deed.goldWeight}
                InputProps={{ readOnly: true }}
              />
              <TextField
                className={classes.specialField}
                type="String"
                label="Gold Purity"
                value={gold.goldPurity === undefined ? '0' : gold.goldPurity}
                InputProps={{ readOnly: true }}
              />
              <TextField
                className={classes.textField}
                type="String"
                variant="outlined"
                label="Amount To List"
                value={amount}
                name="amount"
                fullWidth
                onChange={e => handleChangeAmt(e, deed.goldWeight)}
              />
              <TextField
                className={classes.textField}
                variant="outlined"
                type="Number"
                label="Deed's Unit Price (S$ / 100g)"
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
              onClick={listDeed}
            >List Deed
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                this.setState({
                  amount: 0,
                  price: 0,
                }, () => dispatch({
                  type: CLOSE_LIST_DEED_DIALOG,
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
  specialField: {
    textAlign: 'center',
    marginTop: 20,
    marginRight: 10,
    width: 150,
  },
});

const mapStateToProps = state => ({
  deeds: state.deeds,
  userAssets: state.userAssets,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(CreateDeedDialog);
