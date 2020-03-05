import React, { Component } from 'react';
import { 
    Badge,
    Collapse,
    ListGroup,
    ListGroupItem
 } from 'reactstrap';

class SideBarElement extends Component {

    handleElementClick = (event, imageId=null) => {
        const selected = this.props.selected
        const chapterId = this.props.chapter.id
        if(imageId && selected){
            this.props.onSelectionChanged(chapterId, imageId)
        } else if (selected) {
            this.props.onSelectionChanged(null)
        } else {
            this.props.onSelectionChanged(chapterId)
        }
        return true;
    }

    render() {
        const chapter = this.props.chapter;
        return (
            <div className="SideBarElement" key={chapter.id} id={chapter.id}>
                <div onClick={this.handleElementClick}>
                    {chapter.id}: {chapter.name} <Badge color="info">{chapter.locations.length}</Badge><Badge color="Light">{chapter.images.length}</Badge>
                </div>
                <Collapse isOpen={this.props.selected}>
                    <ListGroup>
	  				    {chapter.images.map((image) =>
                            <ListGroupItem tag="a" key={image.id} onClick={(event)=>this.handleElementClick(event, image.id)}>{image.file}</ListGroupItem>
                        )}
                    </ListGroup>
                </Collapse>
            </div>
        )
    }
}
export default SideBarElement;