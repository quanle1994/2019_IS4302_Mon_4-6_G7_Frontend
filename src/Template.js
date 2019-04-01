/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';

class SideDrawer extends React.Component {
  render() {
    const { classes, dispatch } = this.props;
    return (
      <div className={classes.container}>
      </div>
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

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(SideDrawer);
