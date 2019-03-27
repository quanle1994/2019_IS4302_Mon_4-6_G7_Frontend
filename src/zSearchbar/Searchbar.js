/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import connect from 'react-redux/es/connect/connect';
import classNames from 'classnames';
import { compose } from 'redux';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import history from '../history';
import CartViewer from './CartViewer';
import { OPEN_CART_VIEWER } from '../reducers/cartReducer';
import { UPDATE_PRODUCT_FILTER } from '../reducers/productsReducer';
import { SET_CURRENT_PAGE } from '../reducers/currentPageReducer';

const styles = theme => ({
  root: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    textAlign: 'center',
    width: '50%',
  },
  toolbar: {
    backgroundColor: '#424242',
  },
  toolbarTabs: {
    backgroundColor: '#424242',
    height: '50px',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  inputInput2: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 2,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  userName: {
    marginTop: 8,
    height: 33,
  },
});

export const OPEN_LEFT_DRAWER = 'OPEN_LEFT_DRAWER';
class Searchbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }


  handleOpenCartViewer = (e) => {
    const { dispatch, cartViewerOpen } = this.props;
    if (cartViewerOpen) return;
    dispatch({
      type: OPEN_CART_VIEWER,
      anchorEl: e.currentTarget,
    });
  };

  handleSearchProducts = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: UPDATE_PRODUCT_FILTER,
      filter: e.target.value,
    });
  };

  render() {
    const { value } = this.state;
    const {
      classes, dispatch, currentUser, cartItems, currentPage,
    } = this.props;
    const handleProfileMenuOpen = () => {
      this.setState({}, () => dispatch({
        type: OPEN_LEFT_DRAWER,
      }));
    };
    const handlePageOpen = (page) => {
      this.setState({}, () => {
        dispatch({
          type: SET_CURRENT_PAGE,
          currentPage: page,
        });
        history.push(page);
      });
    };
    const items = Object.values(cartItems).map(obj => obj.quantity).reduce((a, b) => a + b, 0);
    const publicTabs = ['Browse All Gold', 'Shopping Cart', 'Our Mines', 'Verified Sellers'];
    const adminTabs = ['Browse All Gold', 'Join Requests', 'Our Mines', 'Verified Sellers'];
    const minerTabs = ['Browse All Gold', 'Our Mines', 'Verified Sellers'];
    const caTabs = ['Browse All Gold', 'Verification Requests', 'Our Mines', 'Verified Sellers'];
    const type = localStorage.getItem('type');
    const tabs = type === 'ADMIN' ? adminTabs : type === 'MINER' ? minerTabs : type === 'CA' ? caTabs : publicTabs;
    const tTabs = tabs.map(tab => tab.split(' ').join('_').toLowerCase());
    const pos = tTabs.indexOf(currentPage);
    if (value !== pos) this.setState({ value: pos });
    const handleChange = (event, val) => {
      this.setState({ value: val });
      const url = tabs[val].split(' ').join('_').toLowerCase();
      handlePageOpen(url);
    };
    const username = localStorage.getItem('username');
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar className={classes.toolbar}>
            <Typography className={classes.title} variant="h5" color="inherit" noWrap>
              {username === null ? 'WELCOME TO GOLD CHAIN' : `Hi ${username}! Welcome back to GOLD CHAIN!`}
            </Typography>
            <div className={classes.grow} />
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Make a Search!"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                onChange={this.handleSearchProducts}
              />
            </div>
            <div className={classes.sectionDesktop}>
              {currentUser.fullname !== undefined && (
                <div className={classNames([classes.search, classes.userName])}>
                  <InputBase
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput2,
                    }}
                    readOnly
                    value={`${currentUser.type}: ${currentUser.fullname}`}
                  />
                </div>
              )}
              {currentUser.type === 'COMMERCIAL' && (
                <div>
                  <CartViewer />
                  <IconButton color="inherit">
                    <Badge badgeContent={items} color="secondary" invisible={items === 0} onClick={this.handleOpenCartViewer}>
                      <ShoppingCart />
                    </Badge>
                  </IconButton>
                </div>
              )}
              {false && (
                <IconButton
                  aria-owns="material-appbar"
                  aria-haspopup="true"
                  color="inherit"
                  onClick={() => handlePageOpen('shopping_cart')}
                >
                  <ShoppingCart />
                </IconButton>
              )}
              <IconButton
                aria-owns="material-appbar"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </div>
          </Toolbar>
          <div className={classes.toolbarTabs}>
            <Tabs value={value} onChange={handleChange}>
              {tabs.map(tab => (
                <Tab label={tab} />
              ))}
            </Tabs>
          </div>
        </AppBar>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.currentPage.currentUser,
  cartItems: state.cart.cartItems,
  cartViewerOpen: state.cart.cartViewerOpen,
  currentPage: state.currentPage.currentPage,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(styles), connect(mapStateToProps, mapDispatchToProps))(Searchbar);
