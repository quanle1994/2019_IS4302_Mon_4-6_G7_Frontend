/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import Typography from '@material-ui/core/Typography/Typography';
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
import Button from '@material-ui/core/Button/Button';
import TableFooter from '@material-ui/core/TableFooter/TableFooter';
import TablePagination from '@material-ui/core/TablePagination/TablePagination';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { SET_CURRENT_PAGE } from '../reducers/currentPageReducer';
import { MODIFY_CART, OPEN_PAYMENT_DIALOG } from '../reducers/cartReducer';
import WarningDialog from '../commons/WarningDialog';
import history from '../history';

class CartPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 5,
      selectedHeaders: [],
      order: {},
      filterField: 'allfields',
      items: [],
      filterValue: '',
    };
  }

  componentWillMount() {
    const { dispatch, cartItems, payment } = this.props;
    dispatch({
      type: SET_CURRENT_PAGE,
      currentPage: 'shopping_cart',
    });
    const items = Object.values(cartItems).map(obj => ({
      id: obj.product.id,
      productName: obj.product.productName,
      price: obj.product.price,
      category: obj.product.category,
      quantity: obj.product.quantity,
      orderQuantity: obj.quantity,
      subtotal: parseFloat(obj.quantity * obj.product.price).toFixed(2),
    }));
    this.setState({ items });
    if (payment !== undefined) {
      dispatch({
        type: OPEN_PAYMENT_DIALOG,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    // const { cartItems } = nextProps;
    const { filterValue } = this.state;
    // const items = this.transform(cartItems);
    const dummy = { target: { value: filterValue } };
    this.handleFilter(dummy, nextProps);
    // this.setState({ items });
  }

  transform = cartItems => Object.values(cartItems).map(obj => ({
    id: obj.product.id,
    productName: obj.product.productName,
    price: obj.product.price,
    category: obj.product.category,
    quantity: obj.product.quantity,
    orderQuantity: obj.quantity,
    subtotal: parseFloat(obj.quantity * obj.product.price).toFixed(2),
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
    const cartItemsRaw = props !== undefined ? props.cartItems : cartItems;
    const items = this.transform(cartItemsRaw);
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

  handleModifyQuantity = (product, isAdd) => {
    const { dispatch, cartItems } = this.props;
    const item = cartItems[product.id];
    const newCartItems = { ...cartItems };
    if (isAdd) {
      newCartItems[product.id] = {
        product: item.product,
        quantity: Math.min(product.quantity, item.quantity + 1),
        addTime: new Date().getTime(),
      };
    } else {
      newCartItems[product.id] = {
        product: item.product,
        quantity: Math.max(0, item.quantity - 1),
        addTime: new Date().getTime(),
      };
      if (item.quantity === 0) {
        WarningDialog('Do you want to remove this item from your cart?', () => {
          delete newCartItems[product.id];
          localStorage.setItem('cart', JSON.stringify(newCartItems));
          dispatch({
            type: MODIFY_CART,
            cartItems: newCartItems,
          });
        });
      }
    }
    localStorage.setItem('cart', JSON.stringify(newCartItems));
    dispatch({
      type: MODIFY_CART,
      cartItems: newCartItems,
    });
  };

  render() {
    const { classes } = this.props;
    const {
      page, rowsPerPage, order, filterField, items,
    } = this.state;
    const handleChangeFilterField = e => this.setState({
      filterField: e.target.value,
    });
    const headers = ['Product ID', 'Product Name', 'Price', 'Category', 'Remaining Stock', 'Quantity', 'Subtotal', 'Action'];
    const ids = ['id', 'productName', 'price', 'category', 'quantity', 'orderQuantity', 'subtotal'];
    const handleChangePage = (event, p) => { this.setState({ page: p }); };
    const handleChangeRowsPerPage = (event) => {
      this.setState({
        rowsPerPage: event.target.value,
      });
    };
    const number = items.reduce((a, b) => parseFloat(a) + parseFloat(b.subtotal), 0);
    const handleOpenPaymentDialog = () => {
      const { dispatch } = this.props;
      history.push('/payment');
      dispatch({
        type: OPEN_PAYMENT_DIALOG,
      });
    };
    return (
      <div className={classes.container}>
        <div style={{
          position: 'relative',
        }}
        >
          <Typography variant="h4" className={classes.header}>My Cart</Typography>
          <Button
            variant="contained"
            style={{
              backgroundColor: '#E84A5F',
              position: 'absolute',
              bottom: -15,
              right: 30,
            }}
          ><Typography
            variant="h6"
            style={{
              color: 'white',
            }}
            onClick={handleOpenPaymentDialog}
          >Checkout
          </Typography>
          </Button>
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
                  {ids.map(id => (
                    <TableCell padding="dense">{item[id]}</TableCell>
                  ))}
                  <TableCell padding="dense">
                    <div className={classes.buttonWrapper}>
                      <Button variant="fab" className={classNames([classes.button, classes.buttonAdd])} onClick={() => this.handleModifyQuantity(item, true)}>
                        <ArrowDropUp />
                      </Button>
                      <Button variant="fab" className={classNames([classes.button, classes.buttonMinus])} onClick={() => this.handleModifyQuantity(item, false)}>
                        <ArrowDropDown />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={ids.length}
                  count={items.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
                <TableCell>
                  <Typography variant="h6" className={classes.total}>
                    {parseFloat(number).toFixed(2)}
                  </Typography>
                  <Typography variant="h6" className={classes.totalText}>Total:&nbsp;</Typography>
                </TableCell>
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
  cartItems: state.cart.cartItems,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(CartPage);
