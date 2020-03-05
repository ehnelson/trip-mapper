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

    var locations = []
    var index, img
    if (selected == null){
      img = []
      for(index in data){
        locations.push(data[index].locations)
        img = img.concat(data[index].images)
      }
    } else {
      locations.push(data[selected].locations)
      img = data[selected].images
    }

    // Draws a line with the location data
    var pline = []
    for (index in locations){
      pline.push(locations[index].map((ch)=>ch.pos))
    }
    index = 0;

    return (
      <Map 
          className="Map" 
          ref="map" 
          animate={true} 
          duration={2}
          bounds={pline} 
          boundsOptions={{padding: [50, 50]}}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {img.map((pic) =>
          <Marker key={pic.id + " " + pic.chapterId} id={pic.id} chapterId={pic.chapterId} position={pic.pos} onClick={this.handleImageClick}>
              <Popup> Image taken on {(new Date(pic.time)).toLocaleDateString()}</Popup>
          </Marker>
        )}
        {pline.map((ch) =>
          <Polyline color="cyan" key={index++} positions={ch} />
        )}

      </Map>
    )
  }
}

export default SimpleMap