import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import { Paper } from '@material-ui/core';
import listingsApi from '../../api/listings';
import { GET_ALL_PRODUCTS } from '../../reducers/productsReducer';
import ProductCard from '../ProductComponents/ProductCard';

class ProductDisplay extends React.Component {
  componentWillMount() {
    const { dispatch } = this.props;
    listingsApi.getAllListings().then((response) => {
      this.setState({}, () => dispatch({
        type: GET_ALL_PRODUCTS,
        products: response.data,
      }));
    });
  }

  filterProduct = (p, filter) => {
    const string = `id=${p.deedId}|${p.title}|${p.descritpion}|${p.gold.ca}|${p.currentOwner.name}`;
    return string.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
  };

  render() {
    const {
      classes, dispatch, products, filter, currentUser, sort, minmax,
    } = this.props;
    let filteredProducts = products === undefined ? [] : products.filter(p => this.filterProduct(p, filter));
    filteredProducts = filteredProducts.filter(p => p.listingState !== 'NOT_LISTED');
    filteredProducts = sort === -1 ? filteredProducts
      : filteredProducts.sort((p1, p2) => {
        const asc = (parseFloat(p1.price) <= parseFloat(p2.price) ? 1 : -1);
        return sort === 0 ? asc : -asc;
      });
    filteredProducts = filteredProducts.filter((p) => {
      let stat = true;
      if (minmax[0] !== undefined && !isNaN(minmax[0])) stat = stat && p.price >= minmax[0];
      if (minmax[1] !== undefined && !isNaN(minmax[1])) stat = stat && p.price < minmax[1];
      return stat;
    });
    const isUser = currentUser.username !== undefined && currentUser.type !== 'ADMIN';
    return (
      <Paper className={isUser ? classes.products : classes.noOwnership}>
        {filteredProducts.map(p => (<ProductCard key={Math.random()} product={p} />))}
      </Paper>
    );
  }
}

const style = () => ({
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
  sort: state.products.sort,
  minmax: state.products.minmax,
  currentUser: state.currentPage.currentUser,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(ProductDisplay);
