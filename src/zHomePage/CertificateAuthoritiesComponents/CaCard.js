/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import CardActionArea from '@material-ui/core/CardActionArea';
import ClickAwayListener from '@material-ui/core/es/ClickAwayListener/ClickAwayListener';
import convert from "../../commons/NumberConverter";

class CaCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hide: false,
      amount: 0,
    };
  }

  render() {
    const { classes, dispatch, ca } = this.props;
    const { hide, amount } = this.state;
    const stdImg = () => (
      <img
        style={{ width: 'auto', margin: 'auto' }}
        alt="img"
        height={150}
        src="https://d2908q01vomqb2.cloudfront.net/22d200f8670dbdb3e253a90eee5098477c95c23d/2017/10/25/AWSCertificateManager_2b.png"
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
    const hideBox = () => this.setState({ hide: false });
    const handleChange = e => this.setState({
      [e.target.name]: e.target.value,
    });
    return ca !== undefined && (
      <div className={classes.container}>
        <Card>
          <CardActionArea onClick={() => {}}>
            <CardMedia
              className={classes.media}
              title={ca.name}
            >
              <div className={classes.productWrapper}>
                {localStorage.getItem('username') === ca.userId && (
                  <div className={classes.priceTag}>
                    <Typography variant="h6" className={classes.price}>YOU</Typography>
                  </div>
                )}
                {ca.photoDir === null || ca.photoDir === undefined ? stdImg() : orgImg(ca.photoDir)}
              </div>
            </CardMedia>
            <CardContent className={classes.cardContent}>
              <Typography variant="h6">{ca.name}</Typography>
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
                value={ca.email}
              />
            </CardContent>
          </CardActionArea>
        </Card>
      </div>
    );
  }
}

const style = () => ({
  container: {
    width: 282,
    flex: 'none',
    margin: 10,
    float: 'left',
  },
  media: {
    textAlign: 'center',
    height: 200,
  },
  button: {
    marginTop: 5,
    float: 'left',
    color: 'teal',
    borderColor: 'teal',
  },
  productWrapper: {
    position: 'relative',
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
});

const mapStateToProps = state => ({
  miners: state.users.miners,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(CaCard);
