import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import Dialog from '@material-ui/core/Dialog/Dialog';
import Paper from '@material-ui/core/Paper/Paper';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import Button from '@material-ui/core/Button/Button';
import TextField from '@material-ui/core/TextField/TextField';
import Typography from '@material-ui/core/Typography/Typography';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import { CLOSE_PRODUCT_EDIT } from '../reducers/productsReducer';
import history from '../history';
import sellerApi from '../api/seller';
import ErrorDialog from '../commons/ErrorDialog';
import SuccessDialog from '../commons/SuccessDialog';
import listingsApi from '../api/listings';
import { GET_ALL_PRODUCTS } from '../zHomePage/ProductComponents/ProductCarousel';

class ProductEditDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    const { editPID, products } = nextProps;
    const product = products.filter(p => p.id === editPID)[0];
    this.setState({ ...product });
  }

  handleCloseForm = () => {
    const { dispatch } = this.props;
    history.push('/products');
    dispatch({
      type: CLOSE_PRODUCT_EDIT,
    });
  };

  handleUpdateProduct = () => {
    const {
      id, productName, productDescription, quantity, catId, price, photoDir,
    } = this.state;
    const updateReq = {
      id,
      sellerId: localStorage.getItem('id'),
      productName,
      productDescription,
      quantity,
      categoryId: catId,
      price,
      photoDir,
    };
    sellerApi.updateProduct(updateReq)
      .then(() => {
        SuccessDialog('Update Product Successfully', `Product ${productName}`, 'updated');
        this.getAllProducts();
      })
      .catch(error => ErrorDialog(`updating product ${productName}`, error));
  };

  handleDeleteProduct = () => {
    sellerApi.deleteProduct(localStorage.getItem('id'), this.state.id).then(() => {
      SuccessDialog(`Delete Product ${this.state.produtName} Successfully`, `Product ${this.state.productName}`, 'made unavailable');
      this.getAllProducts();
    }).catch(error => ErrorDialog(`deleting product ${this.state.productName}`, error));
  };

  handleChange = e => this.setState({
    [e.target.name]: e.target.value,
  });

  getAllProducts = () => listingsApi.getAllListings().then((response) => {
    const { dispatch } = this.props;
    const products = response.data;
    const catMapping = {};
    products.forEach((a) => {
      // const init = _catMapping[a.category];
      catMapping[a.category] = catMapping[a.category] === undefined ? [] : catMapping[a.category];
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
      classes, productEditOpen, editPID, products, catMapping,
    } = this.props;
    const product = products.filter(p => p.id === editPID)[0];
    const catOptions = Object.keys(catMapping).map(k => ({
      value: parseFloat(catMapping[k][0].catId),
      label: catMapping[k][0].category,
    })).sort((o1, o2) => (o1.label >= o2.label ? 1 : -1));
    const formConfig = [
      {
        left: {
          textfield: true, type: 'number', name: 'id', label: 'Product ID', readOnly: true,
        },
        right: {
          textfield: true, type: 'text', name: 'productName', label: 'Product Name', readOnly: false,
        },
      },
      {
        left: {
          textfield: true, type: 'number', name: 'quantity', label: 'Stock Available', readOnly: false,
        },
        right: {
          textfield: true, type: 'number', name: 'price', label: 'Product Price', readOnly: false,
        },
      },
      {
        left: {
          textfield: true, type: 'number', name: 'soldQuantity', label: 'Sold Quantity', readOnly: true,
        },
        right: {
          textfield: true, type: 'text', name: 'sellerName', label: 'Seller', readOnly: true,
        },
      },
      {
        left: {
          select: true, selectOptions: catOptions, name: 'catId', label: 'Product Category', readOnly: false,
        },
        right: {
          textfield: true, type: 'number', name: 'rating', label: 'Customer Rating', readOnly: true,
        },
      },
      {
        left: {
          textfield: true, type: 'text', name: 'createdText', label: 'Created At', readOnly: true,
        },
        right: {
          textfield: true, type: 'text', name: 'modifiedText', label: 'Last Modified', readOnly: true,
        },
      },
      {
        full: true, multiLine: true, type: 'text', name: 'productDescription', label: 'Product Description', readOnly: false,
      },
    ];
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
    return product !== undefined && (
      <Dialog
        open={productEditOpen}
        maxWidth="lg"
        fullWidth
        onClose={this.handleCloseForm}
      >
        <DialogTitle>Update Product Form</DialogTitle>
        <DialogContent style={{
          textAlign: 'center',
        }}
        >
          <Typography variant="h4">{this.state.productName}</Typography>
          <div className={classes.container}>
            <div className={classes.photo}>
              {product.photoDir === null ? stdImg() : orgImg(product.photoDir)}
            </div>
            <div className={classes.details}>
              {formConfig.map(row => (
                <div>
                  {row.full !== undefined && (
                  <div>
                    {row.textfield !== undefined && (
                    <TextField
                      required={!row.readOnly}
                      fullWidth
                      className={classes.input}
                      type={row.type}
                      name={row.name}
                      label={row.label}
                      value={this.state[row.name]}
                      InputProps={{ readOnly: row.readOnly }}
                      onChange={this.handleChange}
                    />
                    )}
                    {row.select !== undefined && (
                    <TextField
                      fullWidth
                      required={!row.readOnly}
                      className={classes.input}
                      select
                      name={row.name}
                      label={row.label}
                      value={parseFloat(this.state[row.name])}
                      InputProps={{ readOnly: row.readOnly }}
                      onChange={this.handleChange}
                    >
                      {row.selectOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                      ))}
                    </TextField>
                    )}
                    {row.multiLine !== undefined && (
                    <TextField
                      fullWidth
                      required={!row.readOnly}
                      multiline
                      className={classes.input}
                      variant="outlined"
                      rowsMax={5}
                      name={row.name}
                      label={row.label}
                      value={this.state[row.name]}
                      InputProps={{ readOnly: row.readOnly }}
                      onChange={this.handleChange}
                    />
                    )}
                  </div>
                  )}
                  {row.full === undefined && (
                  <div>
                    {row.left.textfield !== undefined && (
                    <TextField
                      className={classes.inputHalfLeft}
                      fullWidth
                      required={!row.left.readOnly}
                      type={row.left.type}
                      name={row.left.name}
                      label={row.left.label}
                      InputProps={{ readOnly: row.left.readOnly }}
                      value={this.state[row.left.name]}
                      onChange={this.handleChange}
                    />
                    )}
                    {row.left.select !== undefined && (
                    <TextField
                      fullWidth
                      required={!row.left.readOnly}
                      className={classes.inputHalfLeft}
                      select
                      name={row.left.name}
                      label={row.left.label}
                      value={parseFloat(this.state[row.left.name])}
                      InputProps={{ readOnly: row.left.readOnly }}
                      onChange={this.handleChange}
                    >
                      {row.left.selectOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                      ))}
                    </TextField>
                    )}
                    {row.right.textfield !== undefined && (
                    <TextField
                      className={classes.inputHalfRight}
                      fullWidth
                      required={!row.right.readOnly}
                      type={row.right.type}
                      name={row.right.name}
                      label={row.right.label}
                      InputProps={{ readOnly: row.right.readOnly }}
                      value={this.state[row.right.name]}
                      onChange={this.handleChange}
                    />
                    )}
                    {row.right.select !== undefined && (
                    <TextField
                      fullWidth
                      className={classes.inputHalfRight}
                      required={!row.right.readOnly}
                      select
                      name={row.right.name}
                      label={row.right.label}
                      value={parseFloat(this.state[row.right.name])}
                      InputProps={{ readOnly: row.right.readOnly }}
                      onChange={this.handleChange}
                    >
                      {row.right.selectOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                      ))}
                    </TextField>
                    )}
                  </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          {product.quantity > 0 && (
            <Button variant="outlined" color="secondary" onClick={this.handleDeleteProduct}>Delete</Button>
          )}
          <Button variant="outlined" color="primary" onClick={this.handleUpdateProduct}>Update</Button>
          <Button variant="outlined" onClick={this.handleCloseForm}>Cancel</Button>
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
  input: {
    marginTop: 20,
  },
  inputHalfLeft: {
    marginTop: 20,
    width: '48%',
    marginRight: '2%',
    float: 'left',
  },
  inputHalfRight: {
    marginTop: 20,
    width: '48%',
    marginLeft: '2%',
    float: 'left',
  },
  photo: {
    width: 800,
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
});

const mapStateToProps = state => ({
  catMapping: state.products.catMapping,
  products: state.products.products,
  productEditOpen: state.products.productEditOpen,
  editPID: state.products.editPID,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(ProductEditDialog);
