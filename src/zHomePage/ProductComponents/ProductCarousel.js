import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import Typography from '@material-ui/core/Typography/Typography';
import { SET_CURRENT_PAGE } from '../../reducers/currentPageReducer';
import ErrorDialog from '../../commons/ErrorDialog';
import listingsApi from '../../api/listings';
import ProductCard from './ProductCard';
import { OPEN_USER_REGISTRATION_FORM } from '../../zDrawer/SideDrawer';
import { OPEN_PRODUCT_VIEWER } from '../../reducers/productsReducer';

export const GET_ALL_PRODUCTS = 'GET_ALL_PRODUCTS';
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
    // listingsApi.getAllListings().then((response) => {
    //   const products = response.data;
    //   const catMapping = {};
    // products.forEach((a) => {
    //   // const init = _catMapping[a.category];
    //   catMapping[a.category] = catMapping[a.category] === undefined ? [] : catMapping[a.category];
    //   catMapping[a.category].push(a);
    // });
    // this.setState({}, () => dispatch({
    //   type: GET_ALL_PRODUCTS,
    //   products,
    //   catMapping,
    //   cats: products.map(p => p.category),
    // }));
    // }).catch(error => ErrorDialog('getting all products', error));
    if (this.props.match === undefined) return;
    const { pId, cId } = this.props.match.params;
    if (pId !== undefined && cId !== undefined) {
      dispatch({
        type: OPEN_PRODUCT_VIEWER,
        pId: parseFloat(pId),
        cId: parseFloat(cId),
        isView: feedback === undefined,
      });
    }
  }

  filterProduct = (p, filter) => {
    const string = `id=${p.id}|${p.productName}|${p.category}|${p.productDescription}`;
    return string.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
  };

  render() {
    const {
      classes, products, filter,
    } = this.props;
    const filteredProducts = products.filter(p => this.filterProduct(p, filter) && p.quantity > 0);
    const cats = {};
    filteredProducts.map((p) => {
      cats[p.category] = cats[p.category] === undefined ? [] : cats[p.category];
      cats[p.category].push(p);
      return true;
    });
    const filteredCats = Object.keys(cats).sort();
    return (
      <div className={classes.container}>
        <div>
          <img alt="test" src="/getPhoto" />
          {filteredCats.map(cat => (
            <div className={classes.catWrapper}>
              <Typography variant="h6">{cat}</Typography>
              <div className={classes.products}>
                {cats[cat].map(p => (
                  <ProductCard product={p} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const style = () => ({
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  catWrapper: {
    marginTop: 20,
  },
  products: {
    minWidth: '100%',
    overflowX: 'scroll',
    display: 'flex',
    flexDirection: 'row',
  },
});

const mapStateToProps = state => ({
  products: state.products.products,
  filter: state.products.filter,
  catMapping: state.products.catMapping,
  cats: state.products.cats,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(ProductCarousel);
