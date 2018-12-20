import React, { Component } from 'react';
import SimpleMap from './SimpleMap.js'
import SideBar from './SideBar.js'

import jsonData from './scripts/aggregate.json';

class TripPlanner extends Component {
  constructor(props){
    super(props)
    this.handleSelectionChanged = this.handleSelectionChanged.bind(this)
    this.state = {
      selected: null
    }
  }

  handleSelectionChanged(id) {
    this.setState({selected: id})
  }

  getData() {
    const loadData = () => JSON.parse(JSON.stringify(jsonData));
    const locations = loadData()

    var data = []
    var lat, lng, loc
    for(var index in locations){
      loc = locations[index]

      lat = parseFloat(loc.lat)
      lng = parseFloat(loc.lng)
      data.push({
        pos: [lat, lng],
        timeStart: parseInt(loc.timeStartMs,10),
        timeEnd: parseInt(loc.timeEndMs,10),
        count: parseInt(loc.count,10),
        id: index
      })
    }
    return data
  }

  componentDidMount() {
    this.setState({data: this.getData()})
  }

  render() {
    return (
      <div className="TripPlanner">
        <SideBar 
          selected = {this.state.selected}
          data = {this.state.data}
          onSelectionChanged = {this.handleSelectionChanged}/>
        <SimpleMap 
          data = {this.state.data}
          selected = {this.state.selected}
          onSelectionChanged = {this.handleSelectionChanged} />
      </div>
    );
  }
}

export default TripPlanner;
