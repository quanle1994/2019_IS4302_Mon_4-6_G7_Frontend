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
import { Table, TableCell, TableRow } from '@material-ui/core';
import sellerApi from '../../api/seller';
import GoldPurchase from './GoldPurchase';

class MinerCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hide: false,
      amount: 0,
      miner: {},
    };
  }

  componentWillMount() {
    const { miner } = this.props;
    if (miner.userId === undefined) return;
    sellerApi.getMinerWithGold(miner.userId).then((res) => {
      this.setState({ miner: { ...res.data } });
    });
  }

  render() {
    const { classes, dispatch, miner } = this.props;
    const { hide, amount, miner: m } = this.state;
    const stdImg = () => (
      <img
        style={{ width: 'auto', margin: 'auto' }}
        alt="img"
        height={150}
        src="https://cdn4.vectorstock.com/i/1000x1000/20/73/gold-miner-waving-hand-isolated-on-white-backgroun-vector-6152073.jpg"
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
    const username = localStorage.getItem('username');
    return miner !== undefined && (
      <div className={classes.container}>
        <Card>
          <CardActionArea onClick={() => {}}>
            <CardMedia
              className={classes.media}
              title={miner.name}
            >
              <div className={classes.productWrapper}>
                {miner.photoDir === null || miner.photoDir === undefined ? stdImg() : orgImg(miner.photoDir)}
              </div>
            </CardMedia>
            <CardContent className={classes.cardContent}>
              <Typography variant="h6">{miner.name}</Typography>
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
                value={miner.email}
              />
            </CardContent>
          </CardActionArea>
          {username === miner.userId && (
            <CardActions
              style={{
                backgroundColor: '#FECEAB',
                height: 60,
              }}
            >
              <div className={classes.you}><Typography variant="h6" className={classes.youText}>YOU</Typography></div>
            </CardActions>
          )}
          {username !== miner.userId && localStorage.getItem('type') === 'CertificateAuthority' && (
            <ClickAwayListener onClickAway={hideBox}>
              <CardActions>
                {!hide && m.goldOwned !== undefined && (
                  <Button
                    variant="outlined"
                    className={classes.button}
                    onClick={() => this.setState({ hide: true })}
                  >Buy Gold
                  </Button>
                )}
                {hide && (
                  <div>
                    <Table>
                      {m.goldOwned.map(g => (
                        <TableRow>
                          <TableCell>
                            <GoldPurchase gold={g} miner={m} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </Table>
                  </div>
                )}
              </CardActions>
            </ClickAwayListener>
          )}
        </Card>
      </div>
    );
  }
}

const style = () => ({
  container: {
    width: 450,
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
  you: {
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#E84A5F',
    borderRadius: 5,
  },
  youText: {
    color: 'white',
  },
});

const mapStateToProps = state => ({
  miners: state.users.miners,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(MinerCard);
