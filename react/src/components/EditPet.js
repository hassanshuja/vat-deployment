import React, { Component } from 'react';
// import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPetDetails, updatePetProfile } from '../actions/petprofile';
import classnames from 'classnames';
//import '../'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

class CreateProfile extends Component {
	constructor(props) {
		super(props);
			this.state = {
        id: null,
				name: '',
				breed: '',
				age: '',
				type: '',
        image: '',
        newImage: null,
				errors: {}
			}
		this.handleInputChange = this.handleInputChange.bind(this)
		this.addProfile = this.addProfile.bind(this)
	}

	componentDidMount() {
		if(!this.props.auth.isAuthenticated) {
			this.props.history.push('/login')
    }
    const { match: { params } } = this.props;
    this.props.getPetDetails(params.id)
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.errors) {
				this.setState({
						errors: nextProps.errors
				});
    }
    if(nextProps.pets.showPet) {
      this.setState({
        name: nextProps.pets.showPet.name,
        breed: nextProps.pets.showPet.breed,
        type: nextProps.pets.showPet.type,
        age: nextProps.pets.showPet.age,
        image: nextProps.pets.showPet.image,
        id: nextProps.pets.showPet._id
      })
    }
	}

	handleInputChange(e) {
		if (e.target.files) {
      this.setState({
        newImage: e.target.files[0]
      })
			// this.setState({
			// 	[e.target.name]: e.target.files[0]
			// })	
		} else {
			this.setState({
				[e.target.name]: e.target.value
			})	
		}
	}

	addProfile(e) {
		e.preventDefault()
		var form = new FormData();
		form.append("id", this.state.id);
		form.append("name", this.state.name);
		form.append("breed", this.state.breed);
		form.append("age", this.state.age);
		form.append("type", this.state.type);
    form.append("image", this.state.image);
    form.append("newImage", this.state.newImage)
		this.props.updatePetProfile(form, this.props.history);
	}
		
	render() { 
    const { errors } = this.state;
		return (
			<div className="main-dasboard pet-edit">
				<div className="container mt-5">
					<div className="card dash-main-card">
					<div className="card-header petlist-head">
							<label>Update Pet Profile</label>
							<Link to="/pets"><FontAwesomeIcon icon={ faArrowLeft }/> Back to Pets List</Link>
						</div>
						<div className="card-body">
							<div className="container">
								<div className="row">
									<div className="col-md-6">
										<form encType="multipart/form-data">
											<div className="form-group">
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
											<div className="form-group">
												<label>Pet Type (Dog, cat, etc.)</label>
													<input
														id="type"
														type="text"
														name="type"
														defaultValue={ this.state.type }
														onChange={ this.handleInputChange }
														className={ classnames('form-control', {'is-invalid': errors.type})}
													/>
													{ errors.type && (<div className="invalid-feedback">{errors.type}</div>) }
											</div>
											<div className="form-group">
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
											<div className="form-group">
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
											{/* <Link to="/pets" className="btn btn-primary mr-2">Back to list</Link> */}
											<button onClick={ this.addProfile }className="btn login-btn-primary">Update</button>
										</form>
									</div>
                  <div className="col-md-6">
                    <div className="pet-img">
                      { this.state.image ? (
                        <img src={ '/images/pets/' + this.state.image } alt={ this.state.name + ' image'}></img>
                      ) : (
                        <img src={ '/no-img.png' } alt={ this.state.name + ' image'}></img>
                      )}
                    </div>
                    <div className="form-group mt-3">
                      <input
                        type="file"
                        name="image"
                        id="image"
                        placeholder="Update File"
                        onChange={ this.handleInputChange } 
                      />
                    </div>
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
	getPetDetails: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  pets: PropTypes.object
}

const mapStateToProps = (state) => ({
	auth: state.auth,
  errors: state.errors,
  pets: state.pets,
})

export default connect(mapStateToProps, { getPetDetails, updatePetProfile })(CreateProfile)

