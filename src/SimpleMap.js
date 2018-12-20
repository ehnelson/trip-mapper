import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

import jsonData from './scripts/aggregate.json';

class SimpleMap extends Component<{}, State> {

  getData() {
    const loadData = () => JSON.parse(JSON.stringify(jsonData));
    const locations = loadData()

    var data = []
    var lat, lng, loc, time, count
    for(var index in locations){
      loc = locations[index]

      lat = parseFloat(loc.lat)
      lng = parseFloat(loc.lng)
      data.push({
        pos: [lat, lng],
        timeStart: parseInt(loc.timeStartMs,10),
        timeEnd: parseInt(loc.timeEndMs,10),
        count: parseInt(loc.count,10),
      })
    }
    return data
  }

  componentDidMount() {
    // This will come in props later
    this.setState({data: this.getData()})
  }

  render() {
    //TODO: Debug display, show timestamps(?) for easy data curation
    if (!this.state){
      return <div />
    }
    return (
      <Map className="Map" center={this.state.data[0].pos} zoom={13}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {this.state.data.map((location) =>
          <Marker key={location.time}  position={location.pos}>
            <Popup> Count {location.count} entries from {(new Date(location.timeStart)).toLocaleDateString()} to {(new Date(location.timeEnd)).toLocaleDateString()}</Popup>
          </Marker>
        )}
      </Map>
    )
  }
}

export default SimpleMap