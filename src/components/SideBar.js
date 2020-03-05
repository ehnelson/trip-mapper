import React, { Component } from 'react';
import SideBarElement from './SideBarElement';

class SideBar extends Component {

  	render() {
  		const data = this.props.data
  		if (!data){
	      return <div className="SideBar"> loading </div>
	    }
  		return(
  			<div className="SideBar"> 
  				<h1> Selected: {this.props.selected} </h1>
	  			<div>
	  				{data.map((chapter) =>
						<SideBarElement 
						  chapter={chapter} 
						  key={chapter.id} 
						  selected={this.props.selected === chapter.id}
						  onSelectionChanged={this.props.onSelectionChanged}
						  />
	  				)}
	  			</div>
	  		</div>
	  	)
  	}
 }

 export default SideBar;