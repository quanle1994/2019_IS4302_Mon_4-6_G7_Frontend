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
import { fade } from '@material-ui/core/styles/colorManipulator';
import adminApi from '../api/admin';
import { OPEN_PRODUCT_CREATE, OPEN_PRODUCT_EDIT, SET_SELLER_PRODUCTS } from '../reducers/productsReducer';
import ErrorDialog from '../commons/ErrorDialog';
import sellerApi from '../api/seller';
import { SET_CURRENT_PAGE } from '../reducers/currentPageReducer';
import history from '../history';
import listingsApi from '../api/listings';
import { GET_ALL_PRODUCTS } from '../zHomePage/ProductComponents/ProductCarousel';

class SellerProductsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 5,
      selectedHeaders: [],
      order: {},
      filterField: 'allfields',
      sellerProducts: [],
      filterValue: '',
    };
  }

  componentWillMount() {
    const { dispatch, currentUser } = this.props;
    dispatch({
      type: SET_CURRENT_PAGE,
      currentPage: 'sellerProductsPage',
    });
    listingsApi.getAllListings().then((response) => {
      const products = response.data;
      const catMapping = {};
      products.forEach((a) => {
        // const init = _catMapping[a.category];
        catMapping[a.category] = [];
        catMapping[a.category].push(a);
      });
      this.setState({}, () => dispatch({
        type: GET_ALL_PRODUCTS,
        products,
        catMapping,
        cats: products.map(p => p.category),
      }));
    }).catch(error => ErrorDialog('getting all products', error));
    this.getSellerProducts(currentUser, dispatch);
    if (this.props.match !== undefined) {
      const { pId } = this.props.match.params;
      const { edit, create } = this.props;
      if (edit !== undefined) {
        dispatch({
          type: OPEN_PRODUCT_EDIT,
          editPID: parseFloat(pId),
        });
      } else if (create !== undefined) {
        dispatch({
          type: OPEN_PRODUCT_CREATE,
        });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { filterValue } = this.state;
    const dummy = { target: { value: filterValue } };
    this.handleFilter(dummy, nextProps);
  }

  getSellerProducts = (currentUser, dispatch) => {
    sellerApi.getMyProducts(currentUser.id).then((response) => {
      dispatch({
        type: SET_SELLER_PRODUCTS,
        sellerProducts: response.data,
      });
    }).catch(error => ErrorDialog('getting seller products', error));
  };

  sortSellerProducts = () => {
    const { sellerProducts, selectedHeaders, order } = this.state;
    const newSellerProducts = sellerProducts.sort((u1, u2) => {
      let result = 0;
      selectedHeaders.map((header) => {
        const check = u1[header] > u2[header] ? 1 : u1[header] === u2[header] ? 0 : -1;
        if (!order[header] && result === 0) result = check;
        else if (order[header] && result === 0) result = -1 * check;
        return true;
      });
      return result;
    });

    this.setState({
      sellerProducts: newSellerProducts,
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
    this.sortSellerProducts();
  };

  handleFilter = (e, props) => {
    const { sellerProducts } = this.props;
    const { filterField } = this.state;
    const filterValue = e.target.value;
    this.setState({ filterValue });
    const products = props !== undefined ? props.sellerProducts : sellerProducts;
    const filteredProducts = products.filter((u) => {
      let orgString = '';
      if (filterField === 'allfields') {
        orgString = Object.values(u).reduce((f1, f2) => `${f1}|${f2}`);
      } else {
        orgString = u[filterField];
      }
      return orgString.toString().toLowerCase().indexOf(filterValue.toLowerCase()) >= 0;
    });
    this.setState({
      sellerProducts: filteredProducts,
    });
  };

  handleOpenCreateProduct = () => history.push('/products/create');

  handleOpenEditProduct = (pid) => history.push(`/products/edit/${pid}`);

  render() {
    const { classes } = this.props;
    const {
      page, rowsPerPage, sellerProducts, order, filterField,
    } = this.state;
    const headers = ['ID', 'Name', 'Category', 'Modified', 'Stock', 'Sold', 'Price', 'Rating', 'Action'];
    const ids = ['id', 'productName', 'category', 'modified', 'quantity', 'soldQuantity', 'price', 'rating'];
    const handleChangePage = (event, p) => { this.setState({ page: p }); };
    const handleChangeRowsPerPage = (event) => {
      this.setState({
        rowsPerPage: event.target.value,
      });
    };
    const handleToggle = id => adminApi.toggleActivity(id)
      .then(() => this.getAllUser()).catch(error => ErrorDialog('changing user\'s activity', error));
    const formatDate = (rawValue) => {
      const value = new Date(rawValue);
      return value.toDateString();
    };
    const handleChangeFilterField = e => this.setState({
      filterField: e.target.value,
    });
    return (
      <div className={classes.container}>
        <div style={{
          position: 'relative',
        }}
        >
          <Typography variant="h4" className={classes.header}>My Products</Typography>
          <Button
            variant="contained"
            style={{
              backgroundColor: '#E84A5F',
              position: 'absolute',
              bottom: -15,
              right: 30,
            }}
          >
            <Typography
              variant="h6"
              style={{
                color: 'white',
              }}
              onClick={this.handleOpenCreateProduct}
            >
              Create Product
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
                  <TableCell padding="none" numeric style={{ cursor: 'pointer' }}>
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
              {sellerProducts.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map(product => (
                <TableRow>
                  {ids.map(id => (
                    <TableCell padding="none" numeric>{id === 'modified' ? formatDate(product[id]) : product[id]}</TableCell>
                  ))}
                  <TableCell padding="none" numeric>
                    <Button
                      variant="outlined"
                      className={classes.editButton}
                      onClick={() => this.handleOpenEditProduct(product.id)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={ids.length}
                  count={sellerProducts.length}
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
    height: '100%',
    width: '100%',
    textAlign: 'center',
    padding: 20,
    boxSizing: 'border-box',
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
  editButton: {
    color: 'teal',
    borderColor: 'teal',
  },
});

const mapStateToProps = state => ({
  currentUser: state.currentPage.currentUser,
  sellerProducts: state.products.sellerProducts,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(SellerProductsPage);
