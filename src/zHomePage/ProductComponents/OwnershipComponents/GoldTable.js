import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import { Paper } from '@material-ui/core';

class GoldTable extends React.Component {
  render() {
    const { classes, dispatch } = this.props;
    return (
      <Paper className={classes.container} />
    );
  }
}

const style = () => ({
  container: {
    height: '100%',
    width: '100%',
  },
});

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(GoldTable);
