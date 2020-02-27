import React, { Component } from 'react';

class DataDisplay extends Component {
	render() {
	    var image = this.props.image
	    if (!image){
	      return <div className="Display"/>
	    }
	    return (
	      <div className="Display">
	        <img className="ImageContainer" src={image} alt="logo" />
	      </div>
	    )
	  }
}	

export default DataDisplay