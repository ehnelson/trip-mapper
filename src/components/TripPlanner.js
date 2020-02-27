import React, { Component } from 'react'
import SimpleMap from './SimpleMap.js'
import SideBar from './SideBar.js'
import DataDisplay from './DataDisplay.js'

import jsonData from '../scripts/aggregate.json'
import imageData from '../scripts/image_metadata.json'

class TripPlanner extends Component {
  constructor(props){
    super(props)
    this.handleSelectionChanged = this.handleSelectionChanged.bind(this)
    this.state = {
      selected: null
    }
  }

  handleSelectionChanged(id, image=false) {
    if (!image) {
      this.setState({selected: id})
    } else {
      var display = this.state.imageData[id].file
      this.setState({
        display: display
      })
    }
  }

  parseLocation(loc){
    var lat = parseFloat(loc.lat)
    var lng = parseFloat(loc.lng)

    var result = {
      pos: [lat, lng],
      timeStart: parseInt(loc.timeStartMs,10),
      timeEnd: parseInt(loc.timeEndMs,10),
      count: parseInt(loc.count,10)
    }

    // Eventually ingest images here with location data
    return result
  }

  parseChapter(rawData){
    var data ={
      name: rawData.name,
      description: rawData.description,
      start: parseInt(rawData.start,10),
      end: parseInt(rawData.end,10),
      pictures: null
    }

    var locations = []
    var loc, child
    for(var index in rawData.children){
      loc = rawData.children[index]
      child = this.parseLocation(loc)
      child.id = index
      locations.push(child)
    }
    data.locations = locations
    return data
  }

  getData() {
    const loadData = () => JSON.parse(JSON.stringify(jsonData));
    const chapters = loadData()

    var data = []
    var rawData, child
    for(var index in chapters){
      rawData = chapters[index]
      child = this.parseChapter(rawData)
      child.id = index
      data.push(child)
    }
    return data
  }

  //Hacky!  Yay!
  getImageData() {
    const loadData = () => JSON.parse(JSON.stringify(imageData));
    const locations = loadData()

    var data = []
    var index, pic, lat, lng, result

    for(index in locations) {
      pic = locations[index]
      lat = parseFloat(pic.lat)
      lng = parseFloat(pic.lng)
      result = {
        pos: [lat, lng],
        time: parseInt(pic.timestamp),
        file: pic.fileName,
        id: index
      }
      data.push(result)
    }
    return data
  }

  componentDidMount() {
    this.setState({
      data: this.getData(),
      imageData: this.getImageData()
    })
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
          imageData = {this.state.imageData}
          selected = {this.state.selected}
          onSelectionChanged = {this.handleSelectionChanged} />
        <DataDisplay
          image = {this.state.display}/>
      </div>
    );
  }
}

export default TripPlanner;
