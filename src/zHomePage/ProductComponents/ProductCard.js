/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import Card from '@material-ui/core/Card/Card';
import CardActions from '@material-ui/core/CardActions/CardActions';
import CardContent from '@material-ui/core/CardContent/CardContent';
import CardMedia from '@material-ui/core/CardMedia/CardMedia';
import Typography from '@material-ui/core/Typography/Typography';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button/Button';
import CardActionArea from '@material-ui/core/CardActionArea/CardActionArea';
import TextField from '@material-ui/core/TextField/TextField';
import { MODIFY_CART } from '../../reducers/cartReducer';
import { OPEN_LEFT_DRAWER } from '../../zSearchbar/Searchbar';
import ErrorDialog from '../../commons/ErrorDialog';
import history from '../../history';
import { OPEN_PRODUCT_VIEWER } from '../../reducers/productsReducer';

class ProductCard extends React.Component {
  handleAddItem = () => {
    const { dispatch, cartItems, product } = this.props;

    if (localStorage.getItem('token') === null) {
      dispatch({
        type: OPEN_LEFT_DRAWER,
      });
      return;
    }

    const item = cartItems[product.id];
    const newCartItems = { ...cartItems };
    if (item === undefined) {
      newCartItems[product.id] = {
        product,
        quantity: 1,
        addTime: new Date().getTime(),
      };
    } else {
      if (item.quantity + 1 > product.quantity) {
        ErrorDialog('adding a Product to Cart', 'Added Quantity Exceeds Remaining Stock');
        return;
      }
      newCartItems[product.id] = {
        product: item.product,
        quantity: item.quantity + 1,
        addTime: new Date().getTime(),
      };
    }
    localStorage.setItem('cart', JSON.stringify(newCartItems));
    dispatch({
      type: MODIFY_CART,
      cartItems: newCartItems,
    });
  };

  handleClickProduct = (pId) => {
    const { dispatch } = this.props;
    history.push(`/view/${pId}`);
    dispatch({
      type: OPEN_PRODUCT_VIEWER,
      pId,
      isView: true,
    });
  };

  render() {
    const { classes, product, currentUser } = this.props;
    const stdImg = () => (
      <img
        style={{ width: 'auto', margin: 'auto' }}
        alt="img"
        height={150}
        src="https://img.etimg.com/thumb/height-480,width-640,imgsize-148822,msid-68557855/gold-4-ts.jpg"
      />
    );
    const orgImg = src => (
      <img
        style={{ width: 'auto', margin: 'auto' }}
        alt="img"
        height={150}
        src={src}
      />
    );
    return (
      <div className={classes.container}>
        <Card>
          <CardActionArea onClick={() => this.handleClickProduct(product.id)}>
            <CardMedia
              className={classes.media}
              title={product.productName}
            >
              <div className={classes.productWrapper}>
                {product.photoDir === null || product.photoDir === undefined ? stdImg() : orgImg(product.photoDir)}
                <div className={classes.priceTag}>
                  <Typography variant="h6" className={classes.price}>{`S$ ${product.unitPrice} / g`}</Typography>
                </div>
              </div>
            </CardMedia>
            <CardContent className={classes.cardContent}>
              <Typography variant="h6">{product.id}. {product.productName}</Typography>
              <TextField
                fullWidth
                InputProps={{ readOnly: true }}
                value={product.productDescription}
              />
            </CardContent>
          </CardActionArea>
          <CardActions className={classes.actions}>
            {currentUser.type === 'BUYER' && (
              <Button variant="fab" color="secondary" aria-label="Add" className={classes.fabButton} onClick={this.handleAddItem}>
                <AddIcon />
              </Button>
            )}
            <Button variant="outlined" className={classes.button} onClick={() => this.handleClickProduct(product.id)}>
              View product
            </Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

const style = () => ({
  container: {
    width: 370,
    flex: 'none',
    margin: 10,
    float: 'left',
  },
  media: {
    textAlign: 'center',
  },
  fabButton: {
    float: 'right',
    backgroundColor: '#E84A5F',
  },
  button: {
    marginTop: 5,
    float: 'left',
    color: 'teal',
    borderColor: 'teal',
  },
  actions: {
    display: 'block',
    overflow: 'hidden',
  },
  cardContent: {
    paddingBottom: 0,
  },
  priceTag: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#E84A5F',
    borderRadius: 5,
  },
  price: {
    color: 'white',
  },
  productWrapper: {
    position: 'relative',
  },
});

const mapStateToProps = state => ({
  currentUser: state.currentPage.currentUser,
  cartItems: state.cart.cartItems,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(ProductCard);
