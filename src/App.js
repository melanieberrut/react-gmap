import React, { Component } from 'react';
import './App.css';
import logo from './logo.svg';
import MyGoogleMap from './MyGoogleMap.js';

class App extends Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img className="App-logo" src={logo} alt="" />
          <h1 className="App-title">This is my location selector</h1>
        </header>
        <div className="map">
          <MyGoogleMap />
        </div>
      </div>
    );
  }
}

export default App;
