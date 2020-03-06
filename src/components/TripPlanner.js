import React, { Component } from 'react'

import SimpleMap from './SimpleMap.js'
import SideBar from './SideBar.js'
import DataDisplay from './DataDisplay.js'

import jsonData from '../scripts/aggregate.json'
import parseData from '../utils/DataParser'


/*
  This class contains most of the logic for the app.
  It will parse our data and pass down to children.
  It also maintains selection state. 
*/
class TripPlanner extends Component {
  constructor(props){
    super(props)
    this.state = {
      chapter: null,
      image: null
    }
  }

  // Select a given chapter, or image if desired.
  handleSelectionChanged = (chapterId, imageId=null) => {
    // Always set chapterID, even if null.
    // Set a display element if possible.
    this.setState({
      chapter: chapterId,
      image: imageId
    })
  }

  // Once the component has been added to the page, we will parse the location/image data
  // and save it into state.
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
          data = {this.state.data}
          selected = {this.state.chapter}
          onSelectionChanged = {this.handleSelectionChanged} 
          image = {Number(this.state.image)}/>
      </div>
    );
  }
}

export default TripPlanner;
