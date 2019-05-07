import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class SideBar extends Component {

  render() { 
    return ( 
      <div className="bg-light border-right" id="sidebar-wrapper">
      <div className="sidebar-heading">Admin Dashboard </div>
      <div className="list-group list-group-flush">
        {/* <Link to="dashboard" className="list-group-item list-group-item-action bg-light">Dashboard</Link> */}
        <Link to="userlist" className="list-group-item list-group-item-action bg-light">Users</Link>
        <Link to="requestlist" className="list-group-item list-group-item-action bg-light">Requests</Link>
        {/* <Link to="#" className="list-group-item list-group-item-action bg-light">Events</Link> */}
        {/* <Link to="#" className="list-group-item list-group-item-action bg-light">Profile</Link> */}
        {/* <Link to="#" className="list-group-item list-group-item-action bg-light">Status</Link> */}
      </div>
    </div>
     );
  }
}
 
export default SideBar;