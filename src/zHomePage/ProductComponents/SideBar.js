/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import Typography from '@material-ui/core/Typography/Typography';
import { Paper, TableHead, TextField } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import { UPDATE_PRODUCT_RANGE, UPDATE_PRODUCT_SORT } from '../../reducers/productsReducer';

class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      select: -1,
      min: null,
      max: null,
    };
  }

  handleChangeRange = (e, ind) => {
    const { dispatch } = this.props;
    const ra = [];
    const name = ind === 0 ? 'min' : 'max';
    this.setState({ [name]: e.target.value });
    ra[ind] = e.target.value;
    dispatch({
      type: UPDATE_PRODUCT_RANGE,
      minmax: [...ra],
    });
  };

  render() {
    const { select, min, max } = this.state;
    const {
      classes, dispatch,
    } = this.props;
    // const sortKeys = ['Popular', 'Price High - Low', 'Price Low - High'];
    const sortKeys = ['Price High - Low', 'Price Low - High'];
    const sortLims = ['Minimum', 'Maximum'];
    const handleChangeCheckbox = (ind) => {
      const s = select === ind ? -1 : ind;
      this.setState({ select: s }, () => {
        dispatch({
          type: UPDATE_PRODUCT_SORT,
          sort: s,
        });
      });
    };
    return (
      <div className={classes.container}>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><Typography variant="h5">Sort</Typography></TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {sortKeys.map((sortKey, ind) => (
                <TableRow key={Math.random()}>
                  <TableCell>
                    {sortKey}
                  </TableCell>
                  <TableCell>
                    <Checkbox checked={ind === select} onChange={() => handleChangeCheckbox(ind)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        <Paper className={classes.paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><Typography variant="h5">Price</Typography></TableCell>
              </TableRow>
            </TableHead>
            {sortLims.map((sortLim, ind) => (
              <TableRow key={`price-${ind}`}>
                <TableCell className={classes.row}>
                  <TextField
                    disableAutoFocus
                    type="number"
                    label={sortLim}
                    value={ind === 0 ? min : max}
                    variant="outlined"
                    onChange={e => this.handleChangeRange(e, ind)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </Paper>
      </div>
    );
  }
}

const style = theme => ({
  container: {
    height: '100%',
    width: '100%',
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  paper: {
    marginTop: 10,
  },
  row: {
    paddingTop: 20,
    paddingBottom: 20,
  },
});

const mapStateToProps = state => ({
  currentPage: state.currentPage.currentPage,
  currentUser: state.currentPage.currentUser,
  cartItems: state.cart.cartItems,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(SideBar);
