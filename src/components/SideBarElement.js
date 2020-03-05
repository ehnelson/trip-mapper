import React, { Component } from 'react';
import { 
    Badge,
    Button,
    Collapse,
    ListGroup,
    ListGroupItem
 } from 'reactstrap';

 /* 
    We create one SideBarElement per chapter.
    It and it's image children are selectable.
 */
class SideBarElement extends Component {

    handleElementClick = (imageId=null) => {
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
        // image Count will probably be removed eventually.  Makes everything easier to debug tho.
        const imageCount = chapter.images.length
        const buttonColor = this.props.selected ? "primary" : "secondary";
        return (
            <div className="SideBarElement" key={chapter.id} id={chapter.id}>
                <Button color={buttonColor} onClick={()=>this.handleElementClick()} block>
                     - {chapter.name} {imageCount > 0 ? <Badge color="info">{chapter.images.length}</Badge> : null}
                </Button>
                {chapter.images.length > 0?
                <Collapse isOpen={this.props.selected}>
                    <ListGroup className="SideBarImageList">
	  				    {chapter.images.map((image) =>
                            <ListGroupItem key={image.id} onClick={()=>this.handleElementClick(image.id)}>{image.file}</ListGroupItem>
                        )}
                    </ListGroup>
                </Collapse>
                :null}
            </div>
        )
    }
}
export default SideBarElement;