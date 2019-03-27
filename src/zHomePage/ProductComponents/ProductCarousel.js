import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import { Paper } from '@material-ui/core';
import { SET_CURRENT_PAGE } from '../../reducers/currentPageReducer';
import ProductCard from './ProductCard';
import { OPEN_USER_REGISTRATION_FORM } from '../../zDrawer/SideDrawer';
import { GET_ALL_PRODUCTS, OPEN_PRODUCT_VIEWER } from '../../reducers/productsReducer';
import SideBar from './SideBar';
import OwnershipPaper from './OwnershipComponents/OwnershipPaper';
import { OPEN_CREATE_DEED_DIALOG } from '../../reducers/deedsReducer';
import listingsApi from '../../api/listings';

class ProductCarousel extends React.Component {
  componentWillMount() {
    const { dispatch, register, feedback } = this.props;
    if (register !== undefined) {
      this.setState({}, () => dispatch({
        type: OPEN_USER_REGISTRATION_FORM,
      }));
    }
    this.setState({}, () => dispatch({
      type: SET_CURRENT_PAGE,
      currentPage: 'browse_all_gold',
      products: [],
    }));
    listingsApi.getAllListings().then((response) => {
      this.setState({}, () => dispatch({
        type: GET_ALL_PRODUCTS,
        products: response.data,
      }));
    });
    if (this.props.match === undefined) return;
    const { pId, cId, gId } = this.props.match.params;
    if (pId !== undefined && cId !== undefined) {
      dispatch({
        type: OPEN_PRODUCT_VIEWER,
        pId: parseFloat(pId),
        cId: parseFloat(cId),
        isView: feedback === undefined,
      });
    }
    if (gId !== undefined) {
      dispatch({
        type: OPEN_CREATE_DEED_DIALOG,
        gId: parseFloat(gId),
      });
    }
  }

  filterProduct = (p, filter) => {
    const string = `id=${p.id}|${p.productName}|${p.category}|${p.productDescription}`;
    return string.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
  };

  render() {
    const {
      classes, products, filter, currentUser,
    } = this.props;
    // const filteredProducts = products.filter(p => this.filterProduct(p, filter) && p.quantity > 0);
    const cats = {};
    // filteredProducts.map((p) => {
    //   cats[p.category] = cats[p.category] === undefined ? [] : cats[p.category];
    //   cats[p.category].push(p);
    //   return true;
    // });
    const isUser = currentUser.username !== undefined && currentUser.type !== 'ADMIN';
    return (
      <div className={classes.container}>
        <div className={classes.sidebar}>
          <SideBar />
        </div>
        <Paper className={isUser ? classes.products : classes.noOwnership}>
          {products !== undefined && products.map(p => (<ProductCard product={p} />))}
        </Paper>
        {isUser && <OwnershipPaper />}
      </div>
    );
  }
}

const style = () => ({
  container: {
    height: '97%',
    marginTop: 10,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  catWrapper: {
    marginTop: 20,
  },
  sidebar: {
    height: '100%',
    width: '22vw',
  },
  products: {
    width: '45vw',
    height: '100%',
    overflowY: 'auto',
  },
  noOwnership: {
    width: '77vw',
    height: '100%',
    overflowY: 'auto',
  },
});

const mapStateToProps = state => ({
  products: state.products.products,
  filter: state.products.filter,
  catMapping: state.products.catMapping,
  cats: state.products.cats,
  currentUser: state.currentPage.currentUser,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(ProductCarousel);
