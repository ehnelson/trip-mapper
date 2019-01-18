import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';

class SimpleMap extends Component<{}, State> {
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
    var zoom = 8
    if (!data){
      return <div />
    }
    const center = (this.props.selected != null) ? data[this.props.selected] : data[0]
    if (this.props.selected != null) {
      zoom = 11
    }

    // Draws a line with the location data
    var pline = []
    var index, loc
    for (index in data){
      loc = data[index]
      pline.push(loc.pos)
    }

    //const flag = (this.props.selected !== 2) ? {display: 'none'} :{}
    //This behaves weird when you select something twice.  (shrug)
    return (
      <Map className="Map" center={center.pos} zoom={zoom}>
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