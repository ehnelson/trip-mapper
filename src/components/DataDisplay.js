import React, { Component } from 'react';
import { 
	Carousel,
	CarouselControl,
	CarouselIndicators,
	CarouselItem
} from 'reactstrap';

class DataDisplay extends Component {
	constructor(props){
		super(props)
		this.state = {
			animating: false
		}
	}	
	
	next = () => {
		const len = this.props.data[this.props.selected].images.length
		const nextIndex = (this.props.image + 1 ) % len
		this.setActiveIndex(nextIndex);
	}

	previous = () => {
		const len = this.props.data[this.props.selected].images.length
		const prevIndex = (this.props.image - 1 + len) % len
		this.setActiveIndex(prevIndex);
	}

	setActiveIndex = (nextIndex) => {
		if (this.state.animating) return;
		this.props.onSelectionChanged(this.props.selected, nextIndex)
	}

	setAnimating = (animating) => {
		this.setState({animating: animating})
	}

	render() {
		var images = null
		if(this.props.selected){
			images = this.props.data[this.props.selected].images
		}
		if (!images){
			//Default nothing selected state.  Should put more here!
	    	return <div className="Display"/>
		}
		var key = 0;
		const slides = images.map((image) => {
			return (
				<CarouselItem 
					onExiting={() => this.setAnimating(true)}
					onExited={() => this.setAnimating(false)}
					key={key++}
				>
					<img src={image.file} alt='' />
				</CarouselItem>
			);
		})

		return (
	    	<div className="Display">
				<div className="DisplayText">
					{this.props.data[this.props.selected].description}
				</div>
				<Carousel
					className="ImageCarousel" 
					activeIndex={this.props.image}
					next={this.next}
					previous={this.previous}
					interval={false}
				>
					<CarouselIndicators items={slides} activeIndex={this.props.image} onClickHandler={this.setActiveIndex} />
					{slides}
					<CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
					<CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
				</Carousel>
	    	</div>
		)
	}
}	

export default DataDisplay
