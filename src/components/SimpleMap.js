import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';

class SimpleMap extends Component {
  constructor(props){
    super(props)
    this.handleImageClick = this.handleImageClick.bind(this)
  }

  handleImageClick(event){
    const id = event.target.options.id
    this.props.onSelectionChanged(id, true)
  }

  render() {
    //TODO: Debug display, show timestamps(?) for easy data curation
    const data = this.props.data;
    const img = this.props.imageData
    if (!data){
      return <div />
    }

    var locations, index
    if (this.props.selected == null){
      locations = []
      for(index in this.props.data){
        locations.push.apply(locations, data[index].locations)
      }
    } else {
      locations = this.props.data[this.props.selected].locations
    }

    // Draws a line with the location data
    var pline = []
    for (index in locations){
      pline.push(locations[index].pos)
    }

    //const flag = (this.props.selected !== 2) ? {display: 'none'} :{}
    //This behaves weird when you select something twice.  (shrug)
    return (
      <Map className="Map" bounds={pline} boundsOptions={{padding: [50, 50]}} >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {img.map((pic) =>
          <Marker key={pic.id} id={pic.id} position={pic.pos} onClick={this.handleImageClick}>
              <Popup> Image taken on {(new Date(pic.time)).toLocaleDateString()}</Popup>
          </Marker>
        )}

        <Polyline color="cyan" positions={pline} />

      </Map>
    )
  }
}

export default SimpleMap