import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import { Paper, TextField, Typography } from '@material-ui/core';
import sellerApi from '../../../api/seller';
import convert from '../../../commons/DollarConverter';
import GoldTable from './GoldTable';
import DeedsTable from './DeedsTable';
import DeedSplitRequestTable from './DeedSplitRequestTable';

class OwnershipPaper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      golds: {},
      money: {},
      deeds: {},
    };
  }

  componentWillMount() {
    sellerApi.getAllAssets().then((res) => {
      console.log(res.data);
      this.setState({ ...res.data });
    }).catch(e => console.log(e));
  }

  render() {
    const { classes, dispatch } = this.props;
    const { golds, deeds, money } = this.state;

    return (
      <Paper className={classes.ownership}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
          <Typography variant="h4" style={{ paddingRight: 30 }}>Your Assets</Typography>
          <TextField
            type="String"
            value={convert(money.balance)}
            label="Money Balance"
            InputLabelProps={{ readOnly: true }}
          />
        </div>
        <div className={classes.section}>
          <GoldTable golds={golds} />
        </div>
        <div className={classes.section}>
          <DeedsTable deeds={deeds} />
        </div>
        <div className={classes.section}>
          <DeedSplitRequestTable deeds={deeds} />
        </div>
      </Paper>
    );
  }
}

const style = () => ({
  ownership: {
    marginLeft: 10,
    width: '32vw',
    padding: 10,
    overflowY: 'auto',
  },
  section: {
    width: '100%',
    height: '50%',
    paddingTop: 10,
  },
});

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(OwnershipPaper);
