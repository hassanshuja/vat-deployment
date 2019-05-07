import React, { Component } from 'react';
// import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getUserDetails, updateUser } from '../../../actions/admin/userActions';
import classnames from 'classnames';
//import '../'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

class EditUser extends Component {
	constructor(props) {
		super(props);
			this.state = {
        id: null,
				name: '',
				email: '',
				password: null,
				errors: {}
			}
		this.handleInputChange = this.handleInputChange.bind(this)
		this.updateProfile = this.updateProfile.bind(this)
	}

	componentDidMount() {
		if(!this.props.auth.isAuthenticated) {
			this.props.history.push('/login')
    }
    const { match: { params } } = this.props;
    this.props.getUserDetails(params.id)
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.errors) {
				this.setState({
						errors: nextProps.errors
				});
    }
    if(nextProps.users.showUser) {
      this.setState({
        name: nextProps.users.showUser.name,
        email: nextProps.users.showUser.email,
        id: nextProps.users.showUser._id
      })
    }
	}

	handleInputChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		})	
	}

	updateProfile(e) {
		e.preventDefault()
		var form = new FormData();
		form.append("id", this.state.id);
		form.append("name", this.state.name);
		form.append("email", this.state.email);
		form.append("password", this.state.password);
		this.props.updateUser(form, this.props.history);
	}
		
	render() { 
    const { errors } = this.state;
		return (
			<div className="main-dasboard pet-edit">
				<div className="container mt-5">
					<div className="card dash-main-card">
					<div className="card-header petlist-head">
							<label>Update User</label>
							<Link to="/userlist"><FontAwesomeIcon icon={ faArrowLeft }/> Back to users List</Link>
						</div>
						<div className="card-body">
							<div className="container">
								<div className="row">
									<div className="col-md-12">
										<form encType="multipart/form-data">
											<input type="hidden" value="something"/>
											<div className="form-group">
												<label>Name</label>
												<input
													type="text"
													id="name"
													name="name"
													placeholder="Name"
													defaultValue={ this.state.name }
                          onChange={ this.handleInputChange }
													className={ classnames('form-control', {'is-invalid': errors.name})}
												/>
												{ errors.name && (<div className="invalid-feedback">{errors.name}</div>) }
											</div>
											<div className="form-group">
												<label>Email</label>
												<input
													type="email"
													id="email"
													name="email"
													placeholder="Email"
													defaultValue={ this.state.email }
                          onChange={ this.handleInputChange }
													className={ classnames('form-control', {'is-invalid': errors.email})}
												/>
												{ errors.email && (<div className="invalid-feedback">{errors.email}</div>) }
											</div>
											<div className="form-group">
												<label>Password</label>
												<input
													type="password"
													id="password"
													name="password"
													placeholder="password"
													// defaultValue={ this.state.password }
													autoComplete="off"
                          onChange={ this.handleInputChange }
													className='form-control'
												/>
											</div>
											<button onClick={ this.updateProfile }className="btn login-btn-primary">Update</button>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

		)
	}
}
 
EditUser.propTypes = {
	getUserDetails: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  users: PropTypes.object
}

const mapStateToProps = (state) => ({
	auth: state.auth,
  errors: state.errors,
  users: state.users,
})

export default connect(mapStateToProps, { getUserDetails, updateUser })(EditUser)

