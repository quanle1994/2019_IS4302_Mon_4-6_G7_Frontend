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
import { MODIFY_CART, OPEN_CART_VIEWER } from '../reducers/cartReducer';
import { UPDATE_PRODUCT_FILTER } from '../reducers/productsReducer';
import { SET_CURRENT_PAGE } from '../reducers/currentPageReducer';
import buyerApi from '../api/buyer';
import { SET_OFFERS } from '../reducers/offerReducer';
import {getOffers} from "../commons/RoutineUpdate";

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
  padding: {
    padding: `0 ${theme.spacing.unit * 2}px`,
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

  componentWillMount() {
    const { dispatch } = this.props;
    getOffers(dispatch);
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
      classes, dispatch, currentUser, cartItems, currentPage, offers,
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
    const items = Object.values(cartItems).filter(o => o.deedOffer.status === 'PENDING').length;
    const offersCount = Object.values(offers).filter(o => o.deedOffer.status === 'PENDING').length;
    const publicTabs = ['Browse All Gold', 'Shopping Cart', 'Offers', 'Our Mines', 'Certificate Authorities'];
    const adminTabs = ['Browse All Gold', 'Join Requests', 'Our Mines', 'Certificate Authorities'];
    const minerTabs = ['Browse All Gold', 'Gold Requests', 'Our Mines', 'Certificate Authorities'];
    const caTabs = ['Browse All Gold', 'Offers', 'Our Mines', 'Certificate Authorities'];
    const type = localStorage.getItem('type');
    const tabs = type === 'ADMIN' ? adminTabs : type === 'Miner' ? minerTabs : type === 'CertificateAuthority' ? caTabs : publicTabs;
    const tTabs = tabs.map(tab => tab.split(' ').join('_').toLowerCase());
    const pos = tTabs.indexOf(currentPage);
    if (value !== pos) this.setState({ value: pos });
    const handleChange = (event, val) => {
      this.setState({ value: val });
      const url = tabs[val].split(' ').join('_').toLowerCase();
      handlePageOpen(url);
    };
    const name = localStorage.getItem('name');
    const display = (tab, count) => (tab !== 'Offers' ? true : count === 0);
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar className={classes.toolbar}>
            <Typography className={classes.title} variant="h5" color="inherit" noWrap>
              {name === null ? 'WELCOME TO GOLD CHAIN' : `Hi ${name}! Welcome back to GOLD CHAIN!`}
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
              {currentUser.type === 'RegisteredUser' && (
                <div>
                  <CartViewer />
                  <IconButton color="inherit">
                    <Badge badgeContent={items} color="secondary" invisible={items === 0} onClick={this.handleOpenCartViewer}>
                      <ShoppingCart />
                    </Badge>
                  </IconButton>
                </div>
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
                <Tab
                  key={Math.random()}
                  label={(
                    <Badge
                      badgeContent={offersCount}
                      className={classes.padding}
                      invisible={display(tab, offersCount)}
                      color="secondary"
                    >
                      {tab}
                    </Badge>
                  )}
                />
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
  offers: state.offers.offers,
  cartViewerOpen: state.cart.cartViewerOpen,
  currentPage: state.currentPage.currentPage,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(styles), connect(mapStateToProps, mapDispatchToProps))(Searchbar);
