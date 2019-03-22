/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import ExpansionPanel from '@material-ui/core/ExpansionPanel/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import classNames from 'classnames';
import 'simplebar';
import 'simplebar/dist/simplebar.css';
import Badge from '@material-ui/core/Badge/Badge';
import { Paper, TableHead, TextField } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import history from '../history';

class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      select: -1,
      range: [],
    };
  }


  render() {
    const { select, range } = this.state;
    const {
      classes,
    } = this.props;
    const sortKeys = ['Popular', 'Price High - Low', 'Price Low - High'];
    const sortLims = ['Minimum', 'Maximum'];
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
                <TableRow>
                  <TableCell>
                    {sortKey}
                  </TableCell>
                  <TableCell>
                    <Checkbox checked={ind === select} onChange={() => { this.setState({ select: select === ind ? -1 : ind }); }} />
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
              <TableRow>
                <TableCell className={classes.row}>
                  <TextField
                    type="number"
                    label={sortLim}
                    value={range[ind]}
                    variant="outlined"
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
    // backgroundColor: '#2A363B',
    paddingTop: 10,
    paddingLeft: 10,
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
