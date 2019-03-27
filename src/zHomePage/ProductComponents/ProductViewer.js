/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import Paper from '@material-ui/core/Paper/Paper';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import Dialog from '@material-ui/core/Dialog/Dialog';
import Typography from '@material-ui/core/Typography/Typography';
import Table from '@material-ui/core/Table/Table';
import TableBody from '@material-ui/core/TableBody/TableBody';
import TableRow from '@material-ui/core/TableRow/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TextField from '@material-ui/core/TextField/TextField';
import Button from '@material-ui/core/Button/Button';
import {CLOSE_PRODUCT_VIEWER, GET_ALL_PRODUCTS} from '../../reducers/productsReducer';
import history from '../../history';
import buyerApi from '../../api/buyer';
import ErrorDialog from '../../commons/ErrorDialog';
import SuccessDialog from '../../commons/SuccessDialog';
import listingsApi from '../../api/listings';

class ProductViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canFeedback: false,
      myComment: '',
      rating: 5,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { pId, isView } = nextProps;
    if (pId > 0 && !isView) {
      buyerApi.checkCanFeedback(localStorage.getItem('id'), pId).then(
        () => this.setState({ canFeedback: true }),
      ).catch(
        () => this.setState({ canFeedback: false }),
      );
    } else {
      this.setState({ canFeedback: false });
    }
  }

  handleClose = () => {
    const { dispatch } = this.props;
    history.push('/');
    dispatch({
      type: CLOSE_PRODUCT_VIEWER,
    });
  };

  handleSubmitFeedback = () => {
    const { cId, dispatch } = this.props;
    const { myComment, rating } = this.state;
    const f = {
      buyerId: parseFloat(localStorage.getItem('id')),
      cId: parseFloat(cId),
      feedback: myComment,
      rating: parseFloat(rating),
    };
    buyerApi.sendFeedback(f).then(() => {
      SuccessDialog('Submit Feedback Successfully', 'Feedback', 'submitted');
      this.updateProducts(dispatch);
    }).catch(error => ErrorDialog('sending feedback', error));
  };

  updateProducts = dispatch => listingsApi.getAllListings().then((response) => {
    const products = response.data;
    const catMapping = {};
    products.forEach((a) => {
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

  render() {
    const {
      classes, products, productViewerOpen, pId,
    } = this.props;
    const { canFeedback, myComment, rating } = this.state;
    if (pId <= 0) return null;
    const product = products.filter(p => p.id === pId)[0];
    const table = product === undefined ? [] : [
      ['Product ID', product.id],
      ['Category', product.category],
      ['Description', product.productDescription],
      ['Price', product.price],
      ['Remaining Stock', product.quantity],
      ['Seller', product.sellerName],
      ['Ratings', product.rating],
    ];
    const comments = product === undefined ? [] : product.comments;
    const stdImg = () => (
      <img
        style={{ width: 'auto', margin: 'auto' }}
        alt="img"
        height={150}
        src="https://lf.lids.com/hwl?set=sku[20957821],c[2],w[1000],h[750]&call=url[file:product]"
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
    return product !== undefined && (
      <Dialog
        open={productViewerOpen}
        onClose={this.handleClose}
        fullWidth
        maxWidth="lg"
      >
        <Paper>
          <DialogTitle>{product.productName}</DialogTitle>
          <DialogContent>
            <div className={classes.container}>
              <div className={classes.photo}>
                {product.photoDir === null ? stdImg() : orgImg(product.photoDir)}
              </div>
              <div className={classes.details}>
                <Typography
                  variant="h4"
                  style={{
                    color: '#E84A5F',
                    marginBottom: 20,
                  }}
                >Product Details
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
                  {canFeedback && (
                    <div className={classes.feedback}>
                      <TextField
                        error
                        variant="outlined"
                        type="number"
                        label="Ratings:"
                        name="rating"
                        value={rating}
                        onChange={handleOnchange}
                        style={{
                          marginTop: 20,
                        }}
                      />
                      <TextField
                        error
                        variant="outlined"
                        multiline
                        rowsMax={3}
                        label={`User - ${localStorage.getItem('fullname')}`}
                        fullWidth
                        placeholder="Enter your feedback"
                        name="myComment"
                        value={myComment}
                        onChange={handleOnchange}
                        style={{
                          marginTop: 20,
                        }}
                      />
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor: 'teal',
                          marginTop: 20,
                        }}
                        onClick={this.handleSubmitFeedback}
                      >
                        <Typography
                          style={{
                            color: 'white',
                          }}
                        >
                          Submit
                        </Typography>
                      </Button>
                    </div>
                  )}
                  <div className={classes.comments}>
                    <Typography
                      variant="h4"
                      style={{
                        color: 'teal',
                        marginTop: 20,
                        marginBottom: 20,
                      }}
                    >Feedback
                    </Typography>
                    <Table>
                      <TableBody>
                        {comments.map(comment => (
                          <TableRow>
                            <TableCell>
                              <TextField
                                variant="outlined"
                                multiline
                                rowsMax={3}
                                label={`${comment.buyerName} - Ratings: ${comment.rating}`}
                                fullWidth
                                value={comment.comment}
                                InputProps={{ readOnly: true }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Paper>
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
  },
  details: {
    flex: 'auto',
    textAlign: 'center',
    height: '100%',
    width: '100%',
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  feedback: {
    textAlign: 'right',
  },
});

const mapStateToProps = state => ({
  products: state.products.products,
  productViewerOpen: state.products.productViewerOpen,
  pId: state.products.pId,
  cId: state.products.cId,
  isView: state.products.isView,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(ProductViewer);
