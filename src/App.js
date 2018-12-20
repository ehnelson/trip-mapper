import React, { Component } from 'react';
import './App.css';
import TripPlanner from './TripPlanner.js'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Something loaded!
        </header>
        <TripPlanner />
      </div>
    );
  }
}

export default App;
