import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';

class SimpleMap extends Component {
  constructor(props){
    super(props)
    this.handleImageClick = this.handleImageClick.bind(this)
  }

  handleImageClick = (event) => {
    const chapterId = event.target.options.chapterId
    const imageId = event.target.options.id
    this.props.onSelectionChanged(chapterId, imageId)
  }

  render() {
    //TODO: Debug display, show timestamps(?) for easy data curation
    const {data, selected} = this.props;
    if (!data){
      return <div />
    }

    var locations, index, img
    if (selected == null){
      locations = []
      img = []
      for(index in data){
        locations = locations.concat(data[index].locations)
        img = img.concat(data[index].images)
      }
    } else {
      locations = data[selected].locations
      img = data[selected].images
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
          <Marker key={pic.id} id={pic.id} chapterId={pic.chapterId} position={pic.pos} onClick={this.handleImageClick}>
              <Popup> Image taken on {(new Date(pic.time)).toLocaleDateString()}</Popup>
          </Marker>
        )}

        <Polyline color="cyan" positions={pline} />

      </Map>
    )
  }
}

export default SimpleMap