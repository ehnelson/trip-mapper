import React, { Component } from 'react';
import TripPlanner from '../components/TripPlanner.js'
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  NavbarText
} from 'reactstrap';
import './App.css';

/* This will eventually contain more information for the webpage itself. 
    Keeping the map logic contained to the TripPlanner.  Maybe needs its own folder? */ 

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">Mapify</NavbarBrand>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink>What is this?</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://www.linkedin.com/in/erikhn/">About Me</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://github.com/ehnelson/trip-mapper">GitHub</NavLink>
            </NavItem>
          </Nav>
          <NavbarText>Erik made this</NavbarText>
        </Navbar>
        <TripPlanner />
      </div>
    );
  }
}

export default App;
