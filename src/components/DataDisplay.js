import React, { Component } from 'react';
import { 
	Card,
	CardText,
	CardTitle,
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
		var activeIndex = (this.props.image !== null ? this.props.image : 0)
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
				<Card className="DisplayText" body outline color="info">
					<CardTitle className="DisplayTextTitle">{this.props.data[this.props.selected].name}</CardTitle>
					<CardText>{this.props.data[this.props.selected].description}</CardText>
				</Card>
				<div >
					
				</div>
				<Carousel
					className="ImageCarousel" 
					activeIndex={activeIndex}
					next={this.next}
					previous={this.previous}
					interval={false}
				>
					<CarouselIndicators items={slides} activeIndex={activeIndex} onClickHandler={this.setActiveIndex} />
					{slides}
					<CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
					<CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
				</Carousel>
	    	</div>
		)
	}
}	

export default DataDisplay
