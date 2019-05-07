import React, { Component } from 'react';

class RequestListElement extends Component {
  constructor(props) {
    super(props);
    this.state = {  }


  }
  render() { 
    const { index, request} = this.props
    return ( 
      <tr key={index}>
        <td>{request._pet._user.name}</td>
        <td>{request._pet.name}</td>
        <td>{request.problem}</td>
        <td>{request.problem_duration}</td>
        <td>{request.eating}</td>
        <td>{request.weight} KG</td>
        <td>
          <button
            onClick={() => this.props.acceptRequest(request._pet._user._id, request._id)}
            className="btn btn-primary"
          >
            Start
          </button>
          {/* <button
            onClick={() => this.props.declineRequest(request._id)}
            className="btn btn-primary"
          >
            Reject
          </button> */}
        </td>
      </tr>
     );
  }
}
 
export default RequestListElement;