/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import Typography from '@material-ui/core/Typography/Typography';
import Button from '@material-ui/core/Button/Button';
import Paper from '@material-ui/core/Paper/Paper';
import classNames from 'classnames';
import TextField from '@material-ui/core/TextField/TextField';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import InputBase from '@material-ui/core/InputBase/InputBase';
import Table from '@material-ui/core/Table/Table';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel/TableSortLabel';
import TableBody from '@material-ui/core/TableBody/TableBody';
import TableFooter from '@material-ui/core/TableFooter/TableFooter';
import TablePagination from '@material-ui/core/TablePagination/TablePagination';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';
import { fade } from '@material-ui/core/styles/colorManipulator';
import history from '../history';
import { SET_CURRENT_PAGE } from '../reducers/currentPageReducer';
import buyerApi from '../api/buyer';
import ErrorDialog from '../commons/ErrorDialog';
import sellerApi from '../api/seller';
import { SET_ORDERS } from '../reducers/ordersReducer';

class OrderPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 5,
      selectedHeaders: [],
      order: {},
      filterField: 'allfields',
      orders: [],
      filterValue: '',
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: SET_CURRENT_PAGE,
      currentPage: localStorage.getItem('type') === 'BUYER' ? 'buyerOrdersPage' : 'sellerOrdersPage',
    });
    this.getOrders(dispatch);
  }

  componentWillReceiveProps(nextProps) {
    const { filterValue } = this.state;
    const dummy = { target: { value: filterValue } };
    this.handleFilter(dummy, nextProps);
  }

  getOrders = (dispatch) => {
    if (localStorage.getItem('type') === 'BUYER') {
      buyerApi.getOrders(localStorage.getItem('id')).then((response) => {
        this.setState({
          orders: response.data,
        }, () => dispatch({
          type: SET_ORDERS,
          orders: response.data,
        }));
      }).catch(error => ErrorDialog('retrieving orders', error));
    } else {
      sellerApi.getOrders(localStorage.getItem('id')).then((response) => {
        this.setState({
          orders: response.data,
        }, () => dispatch({
          type: SET_ORDERS,
          orders: response.data,
        }));
      }).catch(error => ErrorDialog('retrieving orders', error));
    }
  };

  sortOrders = () => {
    const { selectedHeaders, order, orders } = this.state;
    const newOrders = orders.sort((i1, i2) => {
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
      orders: newOrders,
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
    this.sortOrders();
  };

  handleFilter = (e, props) => {
    const { orders } = this.props;
    const { filterField } = this.state;
    const filterValue = e.target.value;
    this.setState({ filterValue });
    const newOrders = props !== undefined ? props.orders : orders;
    const filteredOrders = newOrders.filter((u) => {
      let orgString = '';
      if (filterField === 'allfields') {
        orgString = Object.values(u).reduce((f1, f2) => `${f1}|${f2}`);
      } else {
        orgString = u[filterField];
      }
      return orgString.toString().toLowerCase().indexOf(filterValue.toLowerCase()) >= 0;
    });
    this.setState({
      orders: filteredOrders,
    });
  };

  handleFeedback = (pId, cId) => {
    history.push(`/feedback/${pId}/${cId}`);
  };

  handleShipped = (cId) => {
    sellerApi.setShipped(cId).then(() => {
      const { dispatch } = this.props;
      this.getOrders(dispatch);
    }).catch(error => ErrorDialog('setting status to SHIPPED', error));
  };

  handleDelivered = (cId) => {
    buyerApi.setDelivered(cId).then(() => {
      const { dispatch } = this.props;
      this.getOrders(dispatch);
    }).catch(error => ErrorDialog('setting status to DELIVERED', error));
  };

  render() {
    const { classes, currentUser } = this.props;
    const {
      page, rowsPerPage, order, filterField, orders,
    } = this.state;
    const handleChangeFilterField = e => this.setState({
      filterField: e.target.value,
    });
    const headers = ['ID', 'Date', 'Product ID', 'Product', 'Price', 'Category', 'Quantity', 'Subtotal', 'Status', 'Action'];
    const ids = ['id', 'createdAt', 'productId', 'productName', 'productPrice', 'productCategory', 'quantity', 'orderTotal', 'status'];
    const handleChangePage = (event, p) => { this.setState({ page: p }); };
    const handleChangeRowsPerPage = (event) => {
      this.setState({
        rowsPerPage: event.target.value,
      });
    };
    const formatDate = (rawValue) => {
      const value = new Date(rawValue);
      return value.toDateString();
    };
    const number = orders.reduce((a, b) => parseFloat(a) + parseFloat(b.subtotal), 0);
    return (
      <div className={classes.container}>
        <Typography variant="h4" className={classes.header}>My Orders</Typography>
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
                  <TableCell padding="none" style={{ cursor: 'pointer' }}>
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
              {orders.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map(o => (
                <TableRow>
                  {ids.map(id => (
                    <TableCell padding="none">{id === 'createdAt' ? formatDate(o[id]) : o[id]}</TableCell>
                  ))}
                  <TableCell padding="none">
                    {currentUser.type === 'BUYER' && (
                    <Button
                      variant="outlined"
                      className={classes.button}
                      onClick={() => this.handleFeedback(o.productId, o.cId)}
                    ><Typography>Feedback</Typography>
                    </Button>
                    )}
                    {currentUser.type === 'BUYER' && o.status === 'SHIPPED' && (
                    <Button
                      variant="outlined"
                      className={classes.button}
                      onClick={() => this.handleDelivered(o.cId)}
                    ><Typography>Delivered</Typography>
                    </Button>
                    )}
                    {currentUser.type === 'SELLER' && o.status === 'PAYMENT_CONFIRMED' && (
                    <Button
                      variant="outlined"
                      className={classes.button}
                      onClick={() => this.handleShipped(o.cId)}
                    ><Typography>Shipped</Typography>
                    </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={ids.length}
                  count={orders.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
                {/* <TableCell> */}
                {/* <Typography variant="h6" className={classes.total}> */}
                {/* {parseFloat(number).toFixed(2)} */}
                {/* </Typography> */}
                {/* <Typography variant="h6" className={classes.totalText}>Total:&nbsp;</Typography> */}
                {/* </TableCell> */}
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
    height: '100%',
    width: '100%',
    textAlign: 'center',
  },
  button: {
    color: 'teal',
    borderColor: 'teal',
  },
  header: {
    color: '#E84A5F',
    marginBottom: 20,
  },
  wrapper: {
    backgroundColor: '#FECEAB',
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
  totalText: {
    float: 'right',
    color: '#E84A5F',
  },
  total: {
    float: 'right',
    marginRight: 20,
    color: '#E84A5F',
  },
});

const mapStateToProps = state => ({
  currentUser: state.currentPage.currentUser,
  cartItems: state.cart.cartItems,
  orders: state.orders.orders,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(OrderPage);
