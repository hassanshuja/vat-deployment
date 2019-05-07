import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import $ from 'jquery'
import SideBar from './SideBar';
// import UserList from './users/UsersList'

class  AdminHome extends Component {
  constructor(props) {
    super(props);
    this.state = {  }

  }

  componentDidMount() {
    if(!this.props.auth.isAuthenticated && this.props.auth.roles !== 'admin') {
      if (this.props.history) {
        this.props.history.push('/login');
      }
    }

    $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
    });
  }
  render() { 
    return ( 	
      <div className="d-flex" id="wrapper">
      <SideBar />
      <div id="page-content-wrapper">

        <div className="container-fluid">
          <h1 className="mt-4">Dashboard</h1>
          <p>The starting state of the menu will appear collapsed on smaller screens, and will appear non-collapsed on larger screens. When toggled using the button below, the menu will change.</p>
          <p>Make sure to keep all page content within the <code>#page-content-wrapper</code>. The top navbar is optional, and just for demonstration. Just create an element with the <code>#menu-toggle</code> ID which will toggle the menu when clicked.</p>
        </div>
      </div>
    </div>
   );
  }
}


AdminHome.propTypes = {
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
	auth: state.auth,
})

export  default connect(mapStateToProps)(AdminHome)
