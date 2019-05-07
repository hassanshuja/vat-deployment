// Home.js

import React, { Component } from 'react';
// import gravatar from 'gravatar';
// import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UserHome from './UserHome';
import AdminHome from './admin/AdminHome';

class Home extends Component {
    
	componentDidMount() {
		if(!this.props.auth.isAuthenticated) {
			this.props.history.push('/login');
		}
	}
    
	render() {
		return (
		<div>
			{ this.props.auth.user.role === 'user' ?	<UserHome /> : <AdminHome />	}
		</div>
		);
	}
}

Home.propTypes = {
	auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
	auth: state.auth,
})

export  default connect(mapStateToProps)(Home)