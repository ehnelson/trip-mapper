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
      time = parseInt(loc.timeStartMs,10)
      count = parseInt(loc.count,10)
      data.push({
        pos: [lat, lng],
        time: time,
        count: count,
      })
    }
    return data
  }

  componentDidMount() {
    // This will come in props later
    this.setState({data: this.getData()})
  }

  render() {
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
            <Popup> Count {location.count} entries on {(new Date(location.time)).toLocaleDateString()}</Popup>
          </Marker>
        )}
      </Map>
    )
  }
}

export default SimpleMap