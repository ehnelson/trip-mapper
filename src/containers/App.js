import React, { Component } from 'react';
import TripPlanner from '../components/TripPlanner.js'
import './App.css';

/* This will eventually contain more information for the webpage itself. 
    Keeping the map logic contained to the TripPlanner.  Maybe needs its own folder? */ 

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Hey Cool Map
        </header>
        <TripPlanner />
      </div>
    );
  }
}

export default App;
