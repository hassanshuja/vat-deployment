import React, { Component } from 'react';
// import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createPetProfile } from '../actions/petprofile';
import classnames from 'classnames';
//import '../'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

class CreateProfile extends Component {
	constructor(props) {
		super(props);
			this.state = {
				name: '',
				breed: '',
				age: '',
				type: '',
				image: '',
				errors: {}
			}
		this.handleInputChange = this.handleInputChange.bind(this)
		this.addProfile = this.addProfile.bind(this)
	}

	componentDidMount() {
		if(!this.props.auth.isAuthenticated) {
			this.props.history.push('/login')
		}
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.errors) {
				this.setState({
						errors: nextProps.errors
				});
		}
	}

	handleInputChange(e) {
		if (e.target.files) {
			this.setState({
				[e.target.name]: e.target.files[0]
			})	
		} else {
			this.setState({
				[e.target.name]: e.target.value
			})	
		}
	}

	addProfile(e) {
		e.preventDefault()
		var form = new FormData();
		form.append("name", this.state.name);
		form.append("breed", this.state.breed);
		form.append("age", this.state.age);
		form.append("type", this.state.type);
		form.append("image", this.state.image);
		form.append("user", this.props.auth.user.id);
		this.props.createPetProfile(form, this.props.history);
	}
		
	render() { 
		const { errors } = this.state;
		return ( 
			<div className="main-dasboard">
				<div className="container mt-5">
					<div className="card dash-main-card">
						<div className="card-header petlist-head">
							<label>Create Pet Profile</label>
							<Link to="/dashboard"><FontAwesomeIcon icon={ faArrowLeft }/> Back to Pets List</Link>
						</div>
						<div className="card-body">
							<div className="container">
								<div className="row">
									<div className="col">
										<form encType="multipart/form-data">
											<div className="form-group col-md-6">
												<label>Pet Name</label>
												<input
													type="text"
													id="name"
													name="name"
													placeholder="Pet Name"
													defaultValue={ this.state.name }
													onChange={ this.handleInputChange }
													className={ classnames('form-control', {'is-invalid': errors.name})}
												/>
												{ errors.name && (<div className="invalid-feedback">{errors.name}</div>) }
											</div>
											<div className="form-group col-md-6">
												<label>Pet Type (Dog, cat etc.)</label>
													<input
														id="type"
														defaultValue={ this.state.type}
														placeholder="(Dog, cat etc.)"
														name="type"
														onChange={ this.handleInputChange }
														className={ classnames('form-control', {'is-invalid': errors.type})}
													/>
													{ errors.type && (<div className="invalid-feedback">{errors.type}</div>) }
											</div>
											<div className="form-group col-md-6">
												<label>Pet Breed</label>
												<input
													type="text"
													className={ classnames('form-control', {'is-invalid': errors.breed})}
													id="breed"
													name="breed"
													placeholder="Pet Breed"
													defaultValue={ this.state.breed }
													onChange={ this.handleInputChange }
												/>
												{ errors.breed && (<div className="invalid-feedback">{errors.breed}</div>) }
											</div>
											<div className="form-group col-md-6">
												<label>Age</label>
												<input
													type="text"
													id="age"
													name="age"
													placeholder="Age"
													defaultValue={ this.state.age }
													onChange={ this.handleInputChange }
													className={ classnames('form-control', {'is-invalid': errors.age})}
													/>
													{ errors.age && (<div className="invalid-feedback">{errors.age}</div>) }
											</div>
											<div className="form-group col-md-6">
												<input
													type="file"
													name="image"
													id="image"
													onChange={ this.handleInputChange } 
												/>
												<p className="pet-photo-instruction">Upload pet photo (optional)</p>
											</div>
											{/* <Link to="/dashboard" className="btn btn-primary mr-2">Back</Link> */}
											<button onClick={ this.addProfile }className="btn login-btn-primary">Submit</button>
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
 
CreateProfile.propTypes = {
	createPetProfile: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
	auth: state.auth,
	errors: state.errors
})

export default connect(mapStateToProps, { createPetProfile })(CreateProfile)

