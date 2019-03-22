import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import Button from '@material-ui/core/Button/Button';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import Dialog from '@material-ui/core/Dialog/Dialog';
import TextField from '@material-ui/core/TextField/TextField';
import Typography from '@material-ui/core/Typography/Typography';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import { CLOSE_PRODUCT_CREATE } from '../reducers/productsReducer';
import history from '../history';
import ErrorDialog from '../commons/ErrorDialog';
import listingsApi from '../api/listings';
import { GET_ALL_PRODUCTS } from '../zHomePage/ProductComponents/ProductCarousel';
import sellerApi from '../api/seller';
import SuccessDialog from '../commons/SuccessDialog';

class ProductCreateDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCloseForm = () => {
    const { dispatch } = this.props;
    history.push('/products');
    dispatch({
      type: CLOSE_PRODUCT_CREATE,
    });
  };

  handleChange = e => this.setState({
    [e.target.name]: e.target.value,
  });

  handleCreateProduct = () => {
    const {
      productName, productDescription, quantity, catId, price, photoDir,
    } = this.state;
    const createReq = {
      sellerId: localStorage.getItem('id'),
      productName,
      productDescription,
      quantity,
      categoryId: catId,
      price,
      photoDir,
    };
    sellerApi.createProduct(createReq).then(() => {
      SuccessDialog('Create Product Successfully', 'New Product', 'created', '/products');
      this.getAllProducts();
    }).catch(error => ErrorDialog('creating a new product', error));
  };

  getAllProducts = () => listingsApi.getAllListings().then((response) => {
    const { dispatch } = this.props;
    const products = response.data;
    const catMapping = {};
    products.forEach((a) => {
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
    const { classes, productCreateOpen, catMapping } = this.props;
    const catOptions = Object.keys(catMapping).map(k => ({
      value: parseFloat(catMapping[k][0].catId),
      label: catMapping[k][0].category,
    })).sort((o1, o2) => (o1.label >= o2.label ? 1 : -1));
    const formConfig = [
      {
        full: true, textfield: true, type: 'text', name: 'productName', label: 'Product Name', readOnly: false,
      },
      {
        full: true, textfield: true, type: 'number', name: 'quantity', label: 'Stock Available', readOnly: false,
      },
      {
        full: true, textfield: true, type: 'number', name: 'price', label: 'Product Price', readOnly: false,
      },
      {
        full: true, select: true, selectOptions: catOptions, name: 'catId', label: 'Product Category', readOnly: false,
      },
      {
        full: true, multiLine: true, type: 'text', name: 'productDescription', label: 'Product Description', readOnly: false,
      },
    ];
    return (
      <Dialog
        open={productCreateOpen}
        maxWidth="sm"
        fullWidth
        onClose={this.handleCloseForm}
      >
        <DialogTitle>Create Product Form</DialogTitle>
        <DialogContent style={{
          textAlign: 'center',
        }}
        >
          <Typography variant="h4">{this.state.productName}</Typography>
          <div className={classes.container}>
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
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="primary" onClick={this.handleCreateProduct}>Create</Button>
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
  },
  input: {
    marginTop: 20,
  },
  inputHalfLeft: {
    marginTop: 10,
    width: '48%',
    marginRight: '2%',
    float: 'left',
  },
  inputHalfRight: {
    marginTop: 10,
    width: '48%',
    marginLeft: '2%',
    float: 'left',
  },
});

const mapStateToProps = state => ({
  catMapping: state.products.catMapping,
  cats: state.products.cats,
  productCreateOpen: state.products.productCreateOpen,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(ProductCreateDialog);
