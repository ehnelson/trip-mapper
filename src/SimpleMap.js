import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

class SimpleMap extends Component<{}, State> {
  constructor(props){
    super(props)
    this.handleMarkerClick = this.handleMarkerClick.bind(this)
  }

  handleMarkerClick(event){
    const id = event.target.options.id
    this.props.onSelectionChanged(id)
  }

  render() {
    //TODO: Debug display, show timestamps(?) for easy data curation
    const data = this.props.data;
    if (!data){
      return <div />
    }
    //This behaves weird when you select something twice.  (shrug)
    const center = (this.props.selected != null) ? data[this.props.selected] : data[0]
    return (
      <Map className="Map" center={center.pos} zoom={8}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {data.map((loc) =>
          <Marker key={loc.id} id={loc.id} position={loc.pos} onClick={this.handleMarkerClick}>
            <Popup> Count {loc.count} entries from {(new Date(loc.timeStart)).toLocaleDateString()} to {(new Date(loc.timeEnd)).toLocaleDateString()}</Popup>
          </Marker>
        )}
      </Map>
    )
  }
}

export default SimpleMap