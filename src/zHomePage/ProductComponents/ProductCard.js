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
import Button from '@material-ui/core/Button/Button';
import CardActionArea from '@material-ui/core/CardActionArea/CardActionArea';
import TextField from '@material-ui/core/TextField/TextField';
import history from '../../history';
import { OPEN_PRODUCT_VIEWER } from '../../reducers/productsReducer';
import convert from '../../commons/NumberConverter';

export const truncate = (string, n) => ( string === undefined ? '' : (string.length > n) ? `${string.substr(0, n - 1)}...` : string);

class ProductCard extends React.Component {
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
    const { classes, product, cartItems } = this.props;
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
    const user = localStorage.getItem('username');
    const isPending = Object.values(cartItems).filter(c => c.deedOffer.status === 'PENDING' && c.deedOffer.title === product.title).length > 0;
    return product.gold !== undefined && (
      <div className={classes.container}>
        <Card>
          <CardActionArea onClick={() => this.handleClickProduct(product.deedId)}>
            <CardMedia
              className={classes.media}
              title={product.productName}
            >
              <div className={classes.productWrapper}>
                {product.photoDir === null || product.photoDir === undefined ? stdImg() : orgImg(product.photoDir)}

                {isPending && (
                  <div className={classes.pendingTag}>
                    <Typography variant="h2" className={classes.pending}>PENDING</Typography>
                  </div>
                )}

                <div className={classes.priceTag}>
                  <Typography variant="h6" className={classes.price}>{`${convert(product.price)} / g`}</Typography>
                </div>
                <div className={classes.weightTag}>
                  <Typography component="p" className={classes.weight}>{`${product.goldWeight} g`}</Typography>
                </div>
                <div className={classes.caTag}>
                  <Typography component="p" className={classes.ca}>{truncate(`CA: ${product.gold.ca}`, 16)}</Typography>
                </div>
                <div className={classes.ownerTag}>
                  {user === product.currentOwner.userId && (
                    <Typography component="p" className={classes.yours}>Yours</Typography>
                  )}
                  {user !== product.currentOwner.userId && (
                    <Typography component="p" className={classes.ca}>{truncate(`Owner: ${product.currentOwner.name}`, 17)}</Typography>
                  )}
                </div>
              </div>
            </CardMedia>
            <CardContent className={classes.cardContent}>
              <Typography variant="h6">{product.title}</Typography>
              <TextField
                fullWidth
                InputProps={{
                  readOnly: true,
                  style: {
                    fontStyle: 'italic',
                    fontSize: 15,
                    color: '#546E7A',
                  },
                }}
                value={truncate(product.description, 37)}
              />
            </CardContent>
          </CardActionArea>
          <CardActions className={classes.actions}>
            <Button variant="outlined" className={classes.button} onClick={() => this.handleClickProduct(product.deedId)}>
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
    width: 365,
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
  pendingTag: {
    position: 'absolute',
    top: 115,
    right: 55,
    transform: 'rotate(-30deg)',
  },
  pending: {
    color: 'rgba(232,74,95, 0.7)',
  },
  weightTag: {
    position: 'absolute',
    top: 50,
    right: 0,
    paddingRight: 5,
  },
  weight: {
    color: '#E84A5F',
    fontStyle: 'italic',
  },
  caTag: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
  ownerTag: {
    position: 'absolute',
    top: 20,
    left: 0,
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
  ca: {
    color: '#546E7A',
    fontStyle: 'italic',
  },
  yours: {
    color: '#E84A5F',
    fontStyle: 'italic',
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
