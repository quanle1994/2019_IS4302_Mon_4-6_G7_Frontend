/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import Typography from '@material-ui/core/Typography/Typography';
import classNames from 'classnames';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';
import { fade } from '@material-ui/core/styles/colorManipulator';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import InputBase from '@material-ui/core/InputBase';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { Button } from '@material-ui/core';
import { SET_CURRENT_PAGE } from '../../reducers/currentPageReducer';
import SuccessDialog from '../../commons/SuccessDialog';
import ErrorDialog from '../../commons/ErrorDialog';
import {
  getAllAssets, getAllListings, getMinerGoldRequests,
} from '../../commons/RoutineUpdate';
import sellersApi from '../../api/seller';


class Requests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 10,
      selectedHeaders: [],
      order: {},
      filterField: 'allfields',
      items: [],
      filterValue: '',
    };
  }

  componentWillMount() {
    const { dispatch, requests } = this.props;
    dispatch({
      type: SET_CURRENT_PAGE,
      currentPage: 'gold_requests',
    });
    const items = this.transform(requests);
    this.setState({ items });
  }

  componentWillReceiveProps(nextProps) {
    const { filterValue } = this.state;
    const dummy = { target: { value: filterValue } };
    this.handleFilter(dummy, nextProps);
  }

  transform = offers => Object.values(offers).map(obj => ({
    id: obj.requestId,
    caName: obj.ca.name, // Get buyer's details
    caId: obj.ca.userId,
    goldId: obj.gold.goldId,
    goldWeight: obj.goldWeight,
    goldPurity: obj.gold.purity,
    unitPrice: obj.price,
    total: obj.price * obj.goldWeight,
    status: obj.verificationState,
  }));

  sortItems = () => {
    const { selectedHeaders, order, items } = this.state;
    const newUsers = items.sort((i1, i2) => {
      let result = 0;
      selectedHeaders.map((header) => {
        const val1 = !Number.isNaN(parseFloat(i1[header])) ? parseFloat(i1[header]) : i1[header];
        const val2 = !Number.isNaN(parseFloat(i2[header])) ? parseFloat(i2[header]) : i2[header];
        const check = val1 > val2 ? 1 : val1 === val2 ? 0 : -1;
        if (!order[header] && result === 0) result = check;
        else if (order[header] && result === 0) result = -1 * check;
        return true;
      });
      // console.log(`Comparing ${u1[header]} with ${u2[header]}, result = ${result}` );
      return result;
    });

    this.setState({
      items: newUsers,
    });
  };

  createSortHandler = (header) => {
    const { order, selectedHeaders } = this.state;
    const index = selectedHeaders.indexOf(header);
    if (index >= 0) selectedHeaders.splice(index, 1);
    if (order[header] !== undefined && !order[header]) {
      delete order[header];
    } else {
      if (index < 0) selectedHeaders.push(header);
      else selectedHeaders.splice(index, 0, header);
      if (order[header] === undefined) order[header] = true;
      else order[header] = false;
    }
    this.setState({
      order,
      selectedHeaders,
    });
    this.sortItems();
  };

  handleFilter = (e, props) => {
    const { cartItems } = this.props;
    const { filterField } = this.state;
    const filterValue = e.target.value;
    this.setState({ filterValue });
    const offersRaw = props !== undefined ? props.requests : cartItems;
    const items = this.transform(offersRaw);
    const filteredItems = items.filter((u) => {
      let orgString = '';
      if (filterField === 'allfields') {
        orgString = Object.values(u).reduce((f1, f2) => `${f1}|${f2}`);
      } else {
        orgString = u[filterField];
      }
      return orgString.toString().toLowerCase().indexOf(filterValue.toLowerCase()) >= 0;
    });
    this.setState({
      items: filteredItems,
    });
  };

  handleAcceptRequest = (item) => {
    const { dispatch } = this.props;
    sellersApi.minerSellsGold({
      goldId: item.goldId,
      goldWeight: item.goldWeight,
      ca: item.caId,
      id: item.id,
    }).then(() => {
      getMinerGoldRequests(dispatch);
      getAllListings(dispatch);
      getAllAssets(dispatch);
      SuccessDialog('Accepted Offer', 'Offer', 'accepted');
    }).catch(e => ErrorDialog('accepting offer', e));
  };

  render() {
    const { classes } = this.props;
    const {
      page, rowsPerPage, order, filterField, items,
    } = this.state;
    const handleChangeFilterField = e => this.setState({
      filterField: e.target.value,
    });
    const headers = ['Request ID', 'Certificate Authority', "CA's User Name", 'Gold ID',
      'Gold Weight', 'Gold Purity', 'Price / g', 'Total', 'Action'];
    const ids = ['id', 'caName', 'caId', 'goldId', 'goldWeight', 'goldPurity', 'unitPrice', 'total', 'status'];
    const handleChangePage = (event, p) => { this.setState({ page: p }); };
    const handleChangeRowsPerPage = (event) => {
      this.setState({
        rowsPerPage: event.target.value,
      });
    };
    return (
      <div className={classes.container}>
        <div style={{
          position: 'relative',
        }}
        >
          <Typography variant="h4" className={classes.header}>Gold {items[0].goldId}</Typography>
        </div>
        <Paper className={classes.wrapper}>
          <div className={classes.filterWrapper}>
            <div className={classNames([classes.search, classes.filterBar])}>
              <TextField
                select
                className={classes.filterField}
                value={filterField}
                fullWidth
                onChange={handleChangeFilterField}
              >
                <MenuItem key="allfields" value="allfields">All Fields</MenuItem>
                {headers.slice(0, headers.length - 1).map((header, index) => (
                  <MenuItem key={ids[index]} value={ids[index]}>{header}</MenuItem>
                ))}
              </TextField>
              <InputBase
                placeholder="Filter…"
                onChange={this.handleFilter}
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
              />
            </div>
          </div>
          <Table>
            <TableHead>
              <TableRow>
                {headers.map((header, index) => (
                  <TableCell padding="dense" style={{ cursor: 'pointer' }}>
                    <Tooltip
                      title="sort"
                      placement="top-start"
                      enterDelay={200}
                    >
                      <TableSortLabel
                        active={order[ids[index]] !== undefined}
                        direction={order[ids[index]] ? 'asc' : 'desc'}
                        onClick={() => { this.createSortHandler(ids[index]); }}
                      >
                        {header}
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody className={classes.tableBody}>
              {items.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map(item => (
                <TableRow>
                  {ids.map((id, ind) => {
                    if (ind < ids.length - 1) {
                      return (
                        <TableCell padding="dense">{item[id]}</TableCell>
                      );
                    }
                    return (
                      <TableCell padding="dense">
                        {item.status === 'PENDING' && (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => this.handleAcceptRequest(item)}
                          >Accept
                          </Button>
                        )}
                        {item.status !== 'PENDING' && (
                          <Button
                            variant="outlined"
                            color={item.status === 'APPROVED' ? 'primary' : 'secondary'}
                          >{item.status}
                          </Button>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={ids.length - 2}
                  count={items.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </Paper>
      </div>
    );
  }
}

const style = theme => ({
  container: {
    width: '100%',
    textAlign: 'center',
    marginBottom: 100,
  },
  button: {
    // float: 'left',
    flex: 'none',
    marginRight: 20,
  },
  buttonAdd: {
    backgroundColor: '#99B898',
  },
  buttonMinus: {
    color: 'white',
    backgroundColor: '#E84A5F',
  },
  buttonWrapper: {
    display: 'flex',
    // width: 250,
  },
  header: {
    color: '#E84A5F',
    marginBottom: 20,
  },
  wrapper: {
    // backgroundColor: '#FECEAB',
  },
  tableBody: {
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  activateButton: {
    width: 100,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  inputRoot: {
    color: 'inherit',
    display: 'flex',
    flex: 'auto',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 5,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  filterBar: {
    marginTop: 8,
    height: 33,
    width: '50%',
    float: 'right',
  },
  filterField: {
    width: theme.spacing.unit * 18,
    float: 'left',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(Requests);
