import React, { Component } from 'react';

class SideBar extends Component {
	constructor(props){
		super(props)
		this.handleElementClick = this.handleElementClick.bind(this)
	}

	handleElementClick(event){
		if(event.target.className === "SideBarElement"){
		    const id = event.target.id
		    this.props.onSelectionChanged(id, false)
		} else {
	    	this.props.onSelectionChanged(null)
		}
	}

  	render() {
  		const data = this.props.data
  		if (!data){
	      return <div className="SideBar"> loading </div>
	    }
  		return(
  			<div className="SideBar" onClick={this.handleElementClick}> 
  				<h1> Selected: {this.props.selected} </h1>
	  			<div>
	  				{data.map((loc) =>
	  					<div className="SideBarElement" key={loc.id} id={loc.id}>
	  						{loc.id}: {loc.name} {loc.locations.length}
	  					</div>
	  				)}
	  			</div>
	  		</div>
	  	)
  	}
 }

 export default SideBar;