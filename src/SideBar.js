import React, { Component } from 'react';

class SideBar extends Component<{}, State> {
	constructor(props){
		super(props)
		this.handleElementClick = this.handleElementClick.bind(this)
	}

	handleElementClick(event){
	    const id = event.target.id
	    this.props.onSelectionChanged(id, false)
	}

  	render() {
  		const data = this.props.data
  		if (!data){
	      return <div className="SideBar"> loading </div>
	    }
  		return(
  			<div className="SideBar"> 
  				<h1> Selected: {this.props.selected} </h1>
	  			<div>
	  				{data.map((loc) =>
	  					<div key={loc.id} id={loc.id} onClick={this.handleElementClick}>
	  						{loc.id}: {(new Date(loc.timeStart)).toLocaleDateString()}
	  					</div>
	  				)}
	  			</div>
	  		</div>
	  	)
  	}
 }

 export default SideBar;