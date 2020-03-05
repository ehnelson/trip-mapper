import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';

class SimpleMap extends Component {
  
  handleImageClick = (event) => {
    var chapterId = event.target.options.chapterId
    if( this.props.selected) {
      // This fixes the issue with double selection for now, will investigate later
      chapterId = this.props.selected
    }
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

    return (
      <Map className="Map" bounds={pline} boundsOptions={{padding: [50, 50]}} >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {img.map((pic) =>
          <Marker key={pic.id + " " + pic.chapterId} id={pic.id} chapterId={pic.chapterId} position={pic.pos} onClick={this.handleImageClick}>
              <Popup> Image taken on {(new Date(pic.time)).toLocaleDateString()}</Popup>
          </Marker>
        )}

        <Polyline color="cyan" positions={pline} />

      </Map>
    )
  }
}

export default SimpleMap