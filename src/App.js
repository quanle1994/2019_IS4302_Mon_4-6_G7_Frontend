import React, { Component } from 'react';
import './App.css';
import connect from 'react-redux/es/connect/connect';
import Searchbar from './zSearchbar/Searchbar';
import SideDrawer from './zDrawer/SideDrawer';
import ProductsPage from './zHomePage/ProductsPage';
import 'simplebar';
import 'simplebar/dist/simplebar.css';

class App extends Component {
  render() {
    return (
      <div id="site-container">
        <SideDrawer />
        <Searchbar id="header" />
        <div id="site-body">
          <ProductsPage />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  drawer: state.drawer,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(App);
