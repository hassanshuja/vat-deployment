// Home.js

import React, { Component } from 'react';
// import gravatar from 'gravatar';
// import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faWindowClose, faCamera } from '@fortawesome/free-solid-svg-icons'
import { setSelectedPet, registerPetChat } from '../actions/petprofile';
import Dropzone from 'react-dropzone'
import classnames from 'classnames';

class PetRegister extends Component {
  
  constructor() {
    super();
    this.state = {
        problem: '',
        problem_duration: '',
        eating: '',
        weight: '',
        saveImages: [],
        images: [],
        videos: [],
        saveVideos: [],
        errors: {},
        showStepOne: true,
        showStepTwo: false,
        deleteImage: null,
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.clickStepOne = this.clickStepOne.bind(this);
    this.completeRegistration = this.completeRegistration.bind(this);
    this.backStep = this.backStep.bind(this);
    this.backToList = this.backToList.bind(this);
    this.onDropImage = this.onDropImage.bind(this);
    this.onDropVideo = this.onDropVideo.bind(this);
    this.removeImage = this.removeImage.bind(this);
}

	componentDidMount() {
		if(!this.props.auth.isAuthenticated) {
			this.props.history.push('/login');
    }
    if(!this.props.pets.selectedPet) {
			this.props.history.push('/pets');
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
      this.setState({ [e.target.name] : Array.from(e.target.files)})
    } else {
      this.setState({
        [e.target.name]: e.target.value
      })
    }
  }
  
  clickStepOne(e) {
    this.setState({
      showStepOne: false,
      showStepTwo: true
    })
  }

  onDropImage = (acceptedFiles ) => {
    acceptedFiles.map((file) => {
      const reader = new FileReader()
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result
        Object.assign(file, {
          buffer: binaryStr
        })
      }
      // reader.readAsArrayBuffer(file)
    })

    var prevFile = this.state.images
    var finalFile = []
    if (prevFile.length > 0) {
      finalFile = prevFile.concat(acceptedFiles)
    } else {
      finalFile = acceptedFiles
    }
    this.setState({images: finalFile })
    // this.setState({images: acceptedFiles })
  };

  onDropVideo = (acceptedFiles ) => {
    acceptedFiles.map((file) => {
      const reader = new FileReader()
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
      reader.readAsBinaryString(file);
      reader.onload = (event) => {
        // Do whatever you want with the file contents
        // const binaryStr = reader.result
        // Object.assign(file, {
        //   buffer: binaryStr
        // })
      }
      // reader.readAsArrayBuffer(file)
    })
    // var prevFile = this.state.videos
    // var finalFile = []
    // if (prevFile.length > 0) {
    //   finalFile = prevFile.concat(acceptedFiles)
    // } else {
    //   finalFile = acceptedFiles
    // }
    this.setState({videos: acceptedFiles })
  };

  backStep() {
    this.setState({
      showStepTwo: false,
      showStepOne: true
    })
  }

  backToList() {
    this.props.history.push('/pets')
    this.props.setSelectedPet(null, this.props.history)
  }

  completeRegistration(e) {
		e.preventDefault()
    var petId = this.props.pets.selectedPet._id
    // Images.map((image, index) => {
    //   image.preview.bfu
    // })
    var form = new FormData();
		form.append("problem", this.state.problem);
		form.append("problem_duration", this.state.problem_duration);
		form.append("eating", this.state.eating);
    form.append("weight", this.state.weight);
    form.append("pet", petId);
    form.append("images", JSON.stringify(this.state.images))
    form.append("videos", this.state.videos[0])
    // return false
    this.props.registerPetChat(form, this.props.history);
  }

  removeImage(event, type, index) {
    event.preventDefault();
    const images = this.state.images
    images.splice(index, 1)
    this.setState({ images: images})
  }

  removeVideo(event, type, index) {
    event.preventDefault();
    const videos = this.state.videos
    videos.splice(index, 1)
    this.setState({ videos: videos})
  }

	render() {
    const { showStepOne } = this.state
    const { showStepTwo } = this.state
    const { selectedPet } = this.props.pets
    const { images } = this.state 
    const { videos } = this.state
    const { errors  } = this.state
    function PreviewImages(props){
      const getFiles = props.images
      if (getFiles.length > 0) {
        const listPreview = getFiles.map((item, index) => 
          <div className="col-md-3" key={ index}>
            <img key={index} src={ item.preview} alt={item.name}/>
            <button className="btn-img-del" onClick={ (e) => props.onRemoveImage(e, item, index) }>
              <FontAwesomeIcon icon={ faWindowClose }/>
            </button>
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
        const listPreview = getFiles.map((item, index) => 
          <div className="col-md-6" key={ index}>
            <video key={index} src={ item.preview} width="100%" height="100%" controls/>
            <button className="btn-img-del" onClick={ (e) => props.onRemoveVideo(e, item, index) }>
              <FontAwesomeIcon icon={ faWindowClose }/>
            </button>
          </div>
        );
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
			<div className="main-dasboard">
				<div className="container mt-5 pet-register">
          <form encType="multipart/form-data">
            {/******* /////// STEP 1 ///////  ******/}
              { showStepOne  && selectedPet &&
              <div className="step-1">
                <div className="card dash-main-card">
                  <div className="card-header">
                    <button onClick={ this.backToList } className="back">
                      <FontAwesomeIcon icon={ faArrowLeft } />
                    </button>
                    <h5 className="step-title">Step 1 of 2</h5>
                  </div>
                  <div className="card-body">
                    <div className="container">
                      <div className="row form-group">
                        <h4>What's wrong with { selectedPet.name } today?</h4>
                        <input
                          type="text"
													className={ classnames('form-control', {'is-invalid': errors.problem})}
                          name="problem"
                          onChange={ this.handleInputChange }
                          value= { this.state.problem }
                        />
												{ errors.problem && (<div className="invalid-feedback">{errors.problem}</div>) }
                      </div>
                      <div className="row form-group">
                        <h4>How long has { selectedPet.name } had this problem?</h4>
                        <input
                          type="text"
													className={ classnames('form-control', {'is-invalid': errors.problem_duration})}
                          name="problem_duration"
                          onChange={ this.handleInputChange }
                          value= { this.state.problem_duration }
                        />
												{ errors.problem_duration && (<div className="invalid-feedback">{errors.problem_duration}</div>) }
                      </div>
                      <div className="row form-group">
                        <h4> What has { selectedPet.name } been eating? (including all medication and supplements):</h4>
                        <input
                          type="text"
													className={ classnames('form-control', {'is-invalid': errors.eating})}
                          name="eating"
                          onChange={ this.handleInputChange }
                          value= { this.state.eating }
                        />
												{ errors.eating && (<div className="invalid-feedback">{errors.eating}</div>) }
                      </div>
                      <div className="row form-group">
                        <h4>{ selectedPet.name }'s Weight (Good to input)</h4>
                        <div className="input-group mb-3">
                        <input
                          type="number"
													className={ classnames('form-control', {'is-invalid': errors.weight})}
                          name="weight"
                          onChange={ this.handleInputChange }
                          value= { this.state.weight }
                        />
                          <div className="input-group-append">
                            <span className="input-group-text">KG</span>
                          </div>
												  { errors.weight && (<div className="invalid-feedback">{errors.weight}</div>) }
                        </div>
                      </div>
                      <div className="row form-group">
                        <button onClick={ this.clickStepOne } className="btn btn-primary btn-next">
                          <FontAwesomeIcon icon={ faArrowRight } />
                          </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
            {/******* /////// STEP 2 ///////  ******/}
            { showStepTwo  &&
              <div className="step-2">
                <div className="card dash-main-card">
                  <div className="card-header">
                    <button onClick={ this.backStep } className="back">
                      <FontAwesomeIcon icon={ faArrowLeft } />
                    </button>
                    <h5 className="step-title">Step 2 of 2</h5>
                  </div>
                  <div className="card-body">
                    <div className="container">
                      <h4>Please Upload any Photos or Videos that may help describe the problem</h4>
                      <div className="form-group">
                        <Dropzone
                          accept="image/*"
                          onDrop={this.onDropImage}
                        >
                          {({getRootProps, getInputProps}) => (
                            <div>
                              <section className="container images-dropzone">
                                <div {...getRootProps({className: 'col-md-12 dropzone'})}>
                                  <input {...getInputProps()} />
                                  <FontAwesomeIcon className="img-icon" icon={ faCamera } />
                                  <p className="drop-title">Upload Photo</p>
                                </div>
                              </section>
                              <div className="container">
                                {/* <h4>Uploaded Images:</h4> */}
                                <PreviewImages onRemoveImage={ this.removeImage.bind(this) } images={ images } />
                              </div>
                            </div>
                          )}
                        </Dropzone>
                        <Dropzone
                          accept="video/*"
                          multiple={ false }
                          onDrop={this.onDropVideo}
                        >
                          {({getRootProps, getInputProps}) => (
                            <div>
                              <section className="container videos-dropzone">
                                <div {...getRootProps({className: 'col-md-12 dropzone'})}>
                                  <input {...getInputProps()} />
                                  <FontAwesomeIcon className="img-icon" icon={ faCamera } />
                                  <p className="drop-title">Upload Video</p>
                                </div>
                              </section>
                              <div className="container">
                                {/* <h4>Uploaded Videos:</h4> */}
                                <PreviewVideos onRemoveVideo={ this.removeVideo.bind(this) } videos={ videos } />
                              </div>
                            </div>
                          )}
                        </Dropzone>
                      </div>
                      <div className="row form-group">
                        <button onClick={ this.completeRegistration } className="btn btn-primary btn-next">
                          <h5><b>Complete Registration</b></h5>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          </form>
				</div>
			</div>
		);
	}
}

PetRegister.propTypes = {
  setSelectedPet: PropTypes.func,
	auth: PropTypes.object.isRequired,
  pets: PropTypes.object,
  errors: PropTypes.object
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    pets: state.pets,
    errors: state.errors
})

export  default connect(mapStateToProps, { setSelectedPet, registerPetChat })(PetRegister)