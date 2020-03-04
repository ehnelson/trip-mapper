import React, { Component } from 'react'
import SimpleMap from './SimpleMap.js'
import SideBar from './SideBar.js'
import DataDisplay from './DataDisplay.js'

import jsonData from '../scripts/aggregate.json'
import parseData from '../utils/DataParser'

class TripPlanner extends Component {
  constructor(props){
    super(props)
    this.state = {
      chapter: null,
      display: null
    }
  }

  handleSelectionChanged = (chapterId, imageId=false) => {
    if (!imageId) {
      this.setState({
        chapter: chapterId,
        display: null
      })
    } else {
      var display = this.state.data[chapterId].images[imageId].file
      this.setState({
        chapter: chapterId,
        display: display
      })
    }
  }

  componentDidMount() {
    const rawData = JSON.parse(JSON.stringify(jsonData))
    const data = parseData(rawData)
    this.setState({
      data: data
    })
  }

  render() {
    return (
      <div className="TripPlanner">
        <SideBar 
          data = {this.state.data}
          selected = {this.state.chapter}
          onSelectionChanged = {this.handleSelectionChanged}/>
        <SimpleMap 
          data = {this.state.data}
          selected = {this.state.chapter}
          onSelectionChanged = {this.handleSelectionChanged} />
        <DataDisplay
          image = {this.state.display}/>
      </div>
    );
  }
}

export default TripPlanner;
