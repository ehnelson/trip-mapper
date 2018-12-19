import React, { Component } from 'react';
import './App.css';
import SimpleMap from './SimpleMap.js'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Something loaded!
        </header>
        <SimpleMap />
      </div>
    );
  }
}

export default App;
