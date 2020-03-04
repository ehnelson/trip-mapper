import React, { Component } from 'react'
import SimpleMap from './SimpleMap.js'
import SideBar from './SideBar.js'
import DataDisplay from './DataDisplay.js'

import jsonData from '../scripts/aggregate.json'

class TripPlanner extends Component {
  constructor(props){
    super(props)
    this.handleSelectionChanged = this.handleSelectionChanged.bind(this)
    this.state = {
      chapter: null,
      display: null
    }
  }

  handleSelectionChanged(chapterId, imageId=false) {
    if (!imageId) {
      this.setState({
        chapter: chapterId,
        display: null
      })
    } else {
      var display = this.state.data[chapterId].images[imageId].file
      this.setState({
        chapter: chapterId, //Maybe?
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

    return result
  }

  parseImage(pic) {
    var lat = parseFloat(pic.lat)
    var lng = parseFloat(pic.lng)

    var result = {
      pos: [lat, lng],
      time: parseInt(pic.timestamp),
      file: pic.fileName
    }
    return result
  }

  parseChapter(rawData, chapterId){
    var data ={
      name: rawData.name,
      description: rawData.description,
      start: parseInt(rawData.start,10),
      end: parseInt(rawData.end,10),
      id: chapterId
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

    var images = []
    var img, imgData
    for(var imgIndex in rawData.images){
      img = rawData.images[imgIndex]
      imgData = this.parseImage(img)
      imgData.id = imgIndex
      imgData.chapterId = chapterId
      images.push(imgData)
    }
    data.images = images

    return data
  }

  getData() {
    const chapters = JSON.parse(JSON.stringify(jsonData))

    var data = []
    var rawData, child
    for(var index in chapters){
      rawData = chapters[index]
      child = this.parseChapter(rawData, index)
      data.push(child)
    }

    return data
  }

  componentDidMount() {
    this.setState({
      data: this.getData()
    })
  }

  render() {
    return (
      <div className="TripPlanner">
        <SideBar 
          selected = {this.state.chapter}
          data = {this.state.data}
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
