/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import Dialog from '@material-ui/core/Dialog/Dialog';
import Typography from '@material-ui/core/Typography/Typography';
import Table from '@material-ui/core/Table/Table';
import TableBody from '@material-ui/core/TableBody/TableBody';
import TableRow from '@material-ui/core/TableRow/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TextField from '@material-ui/core/TextField/TextField';
import Button from '@material-ui/core/Button/Button';
import { DialogActions } from '@material-ui/core';
import { CLOSE_PRODUCT_VIEWER } from '../../reducers/productsReducer';
import history from '../../history';
import convert from '../../commons/NumberConverter';
import buyerApi from '../../api/buyer';
import ErrorDialog from '../../commons/ErrorDialog';
import SuccessDialog from '../../commons/SuccessDialog';
import { MODIFY_CART } from '../../reducers/cartReducer';

class ProductViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      price: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { products, pId } = nextProps;
    if (pId <= 0) return;
    const product = products.filter(p => p.deedId === pId)[0];
    if (product === undefined) return;
    this.setState({ price: product.price * product.goldWeight });
  }

  handleClose = () => {
    const { dispatch } = this.props;
    history.push('/');
    dispatch({
      type: CLOSE_PRODUCT_VIEWER,
    });
  };

  handleOffer = () => {
    const { price } = this.state;
    const { dispatch, pId } = this.props;
    buyerApi.offer({
      offerPrice: price,
      deedId: pId,
      buyerId: localStorage.getItem('username'),
    }).then(() => {
      const offers = {};
      buyerApi.getMyOffers().then((res) => {
        res.data.forEach((o) => {
          offers[o.transactionId] = o;
        });
        dispatch({
          type: MODIFY_CART,
          cartItems: { ...offers },
        });
      }).catch(e => console.log(e));

      SuccessDialog('Make Offer Successful', 'Offer', 'lodged', '/', () => dispatch({
        type: CLOSE_PRODUCT_VIEWER,
      }));
    }).catch(e => ErrorDialog('making an offer', e));
  };

  render() {
    const {
      classes, products, productViewerOpen, pId, dispatch,
    } = this.props;
    const { price } = this.state;
    if (pId <= 0) return null;
    const product = products.filter(p => p.deedId === pId)[0];
    const table = product === undefined ? [] : [
      ['Deed ID', product.deedId],
      ['Type of Sale', product.listingState === 'FOR_SALE' ? '1 TO 1 SALE' : 'AUCTION'],
      ['Description', product.description],
      ['Price', `${convert(product.price)} / g`],
      ['Weight', `${product.goldWeight} g`],
      ['Total', convert(product.price * product.goldWeight)],
      ['Seller', product.currentOwner.name],
      ['Gold Purity', product.purity],
    ];
    // const comments = product === undefined ? [] : product.comments;
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
    const handleOnchange = e => this.setState({
      [e.target.name]: e.target.value,
    });
    const type = localStorage.getItem('type');
    const userId = localStorage.getItem('username');
    const dots = product === undefined || product.photoDirs === undefined || product.photoDirs === null ? [''] : product.photoDirs;
    return product !== undefined && (
      <Dialog
        open={productViewerOpen}
        onClose={this.handleClose}
        fullWidth
        maxWidth="lg"
      >
        <DialogContent>
          <div className={classes.container}>
            <div className={classes.photo}>
              {product.photoDirs === null || product.photoDirs === undefined || product.photoDirs[0] === undefined
                ? stdImg() : orgImg(product.photoDir)}
              <Typography
                component="p"
                style={{
                  color: '#E84A5F',
                  marginBottom: 20,
                  fontSize: 20,
                }}
              >{product.title}
              </Typography>
              <div className={classes.dotsWrapper}>
                {dots.map(() => (<div className={classes.dot} />))}
              </div>
            </div>
            <div className={classes.details}>
              <Typography
                variant="h4"
                style={{
                  color: '#E84A5F',
                  marginBottom: 20,
                }}
              >Deed Details
              </Typography>
              <Table>
                <TableBody>
                  {table.map(row => (
                    <TableRow>
                      {row.map(field => (
                        <TableCell>{field}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className={classes.bottomWrapper}>
                <div className={classes.comments}>
                  <Typography
                    variant="h4"
                    style={{
                      color: 'teal',
                      marginTop: 20,
                      marginBottom: 20,
                    }}
                  >History
                  </Typography>
                  {userId === product.currentOwner.userId && (
                  <div>
                    <Typography
                      variant="h4"
                      style={{
                        color: 'teal',
                        marginTop: 20,
                        marginBottom: 20,
                      }}
                    >Available Offers
                    </Typography>
                  </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          {type === 'RegisteredUser' && product.currentOwner.userId !== localStorage.getItem('username') && (
          <TextField
            variant="outlined"
            label="Offer Price"
            value={price}
            name="price"
            onChange={handleOnchange}
          />
          )}
          {type === 'RegisteredUser' && product.currentOwner.userId !== localStorage.getItem('username') && (
          <Button
            variant="contained"
            color="primary"
            className={classes.offerButton}
            onClick={this.handleOffer}
          >Offer to Buy
          </Button>
          )}
          <Button
            variant="outlined"
            className={classes.closeButton}
            onClick={() => {
              history.push('/');
              dispatch({
                type: CLOSE_PRODUCT_VIEWER,
              });
            }}
          >Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const style = () => ({
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  photo: {
    width: 500,
    height: '100%',
    textAlign: 'center',
  },
  details: {
    flex: 'auto',
    textAlign: 'center',
    height: '100%',
    width: '100%',
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  offerButton: {
    width: 150,
    marginLeft: 20,
  },
  closeButton: {
    width: 100,
  },
  dotsWrapper: {
    float: 'left',
  },
  dot: {
    cursor: 'pointer',
  },
});

const mapStateToProps = state => ({
  products: state.products.products,
  productViewerOpen: state.products.productViewerOpen,
  pId: state.products.pId,
  isView: state.products.isView,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(ProductViewer);
