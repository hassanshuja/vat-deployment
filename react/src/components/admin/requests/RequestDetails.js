import React, { Component } from 'react';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

class RequestDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {  }


  }
  render() { 
    const { requestDetails} = this.props
    function PreviewImages(props){
      const getFiles = props.images
      if (getFiles.length > 0) {
        const listPreview = getFiles.map((item, index) => 
          <div className="col-md-3" key={ index}>
            <img key={index} src={'/images/chats/' + item.name} alt={item.name}/>
          </div>
        );
        return (
          <div className="row uploaded-media">{ listPreview }</div>
        )
      } else {
        return (
          <div className="col-md-2 uploaded-media"></div>
        )
      }
    }
    function PreviewVideos(props){
      const getFiles = props.videos
      if (getFiles.length > 0) {
        const listPreview = getFiles.map((item, index) => {
          if (item) {
            return (
              <div className="col-md-6" key={ index}>
                <video key={index} src={'/images/chats/' + item } width="100%" height="100%" controls/>
              </div>
            )
          }
        });
        return (
          <div className="row uploaded-media uploaded-videos">{ listPreview }</div>
        )
      } else {
        return (
          <div className="col-md-2 uploaded-media"></div>
        )
      }
    }
    return (
      <Tabs defaultActiveKey="user" id="uncontrolled-tab-example">
        <Tab eventKey="user" title="User Information">
          <div className="row user-info-tab">
            <div className="col-md-12 pt-2">
              <div>
                <label><b>Name:</b> { requestDetails._pet._user.name }</label>
              </div>
              <div>
                <label><b>Email:</b> { requestDetails._pet._user.email }</label>
              </div>
            </div>
          </div>
        </Tab>
        <Tab eventKey="pet" title="Pet Information">
          <div className="row pet-info-tab">
            <div className="col-md-12 pt-2">
              <div className="pet-img mb-2">
                <img src={'/images/pets/' + requestDetails._pet.image } alt="petimage"/>
              </div>
              <div>
                <label><b>Name:</b> { requestDetails._pet.name }</label>
              </div>
              <div>
                <label><b>Age:</b> { requestDetails._pet.age }</label>
              </div>
              <div>
                <label><b>Breed:</b> { requestDetails._pet.breed }</label>
              </div>
              <div>
                <label><b>Type:</b> { requestDetails._pet.type }</label>
              </div>
            </div>
          </div>
        </Tab>
        <Tab eventKey="other" title="Case History">
          <div className="row other-info-tab">
            <div className="col-md-12 pt-2">
              <div>
                <label><b>Problem:</b> { requestDetails.problem }</label>
              </div>
              <div>
                <label><b>Problem Duration</b>: { requestDetails.problem_duration }</label>
              </div>
              <div>
                <label><b>Eating:</b> { requestDetails.problem_duration }</label>
              </div>
              <div>
                <label><b>Weight:</b> { requestDetails.weight }KG</label>
              </div>
              <div>
                <PreviewImages images={requestDetails.images}></PreviewImages>
              </div>
              <div>
                <PreviewVideos videos={requestDetails.videos}></PreviewVideos>
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>
     );
  }
}
 
export default RequestDetails;