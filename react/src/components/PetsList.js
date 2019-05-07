// Home.js
import React, { Component } from 'react';
// import gravatar from 'gravatar';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAllPets, setSelectedPet, deleteSelectedPet, registerPetChat } from '../actions/petprofile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import Pagination from "react-js-pagination";
import { withRouter } from 'react-router'

class PetsList extends Component {

	constructor() {
		super();
		this.state = {
			selectedPet: '',
			activePage: null,
			totalItemsCount: null
		}
		
	}
   
	componentDidMount() {
		if(!this.props.auth.isAuthenticated) {
			this.props.history.push('/login');
		} else {
			this.props.getAllPets(this.props.auth.user.id, 1, this.props.history);
		}
		this.ChatVet = this.ChatVet.bind(this);
		this.ChatVetDirectly = this.ChatVetDirectly.bind(this);
		this.deletePet = this.deletePet.bind(this);
		this.handlePageChange = this.handlePageChange.bind(this);
		if(this.props.history) {
			this.props.history.push('/dashboard')
		}
	}
	
	componentWillReceiveProps(props) {
		if (props) {
			var currentPage = props.pets.petsList.current
			var totalPages = props.pets.petsList.pages
			if (currentPage && totalPages) {
				this.setState({
					activePage: currentPage,
					totalItemsCount: totalPages
				})
			}
		}
	}

	handlePageChange(pageNumber) {
		this.props.getAllPets(this.props.auth.user.id, pageNumber, this.props.history)
	}
	
	ChatVetDirectly(petId) {
		var form = new FormData();
		form.append("chat_direct", true)
		form.append("pet", petId)
		this.props.registerPetChat(form, this.props.history)
	}

	ChatVet(pet) {
		this.props.setSelectedPet(pet, this.props.history)
		this.props.history.push('/petregister')
	}

	viewNotes(pet) {
		this.props.history.push('/pets/notes/' + pet._id)
	}

	deletePet(pet) {
		Swal.fire({
			title: 'Delete ' + pet.name,
			text: "You won't be able to revert this!",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
			if (result.value) {
				var form = new FormData();
				form.append('id', pet._id);
				form.append('image', pet.image);
				this.props.deleteSelectedPet(form, this.props.history)
				/********** GET PETS LIST **********/
				this.props.getAllPets(this.props.auth.user.id, 1, this.props.history)
			}
		})
	}
	render() {
		const { pets } = this.props
		var Found = false
		function PetsList(props) {
			const list = props.petsList;
			if (list && list.pets && list.pets.length > 0) {
				const listPets = list.pets.map((pet, index) =>
					<div key={index}>
						<div className="row list-row">
							<div className="col-md-2 img-block">
								{ pet.image ? (
									<img src={'/images/pets/' + pet.image} alt={ pet.name + ' Image'}></img>
								) : (
									<img src={'/no-img.png'} alt={ pet.name + ' Image'}></img>
								)}
							</div>
							<div className="col-md-7 desc-block">
								<div className="pet-name">{ pet.name }</div>
								<div className="pet-breed">{ pet.breed }</div>
								{/* <div className="pet-age"><b>Age: </b> { pet.age }</div> */}
								<Link to={'/pet/' + pet._id + '/edit'} className="pet-icons pet-edit"><FontAwesomeIcon icon={ faPen } /></Link>
								<button onClick={ () => props.onDelete(pet) } className="pet-icons pet-delete"><FontAwesomeIcon icon={ faTrash } /></button>
							</div>
							<div className="col-md-3 actions-block text-right">
								{/* <button onClick={ () => props.onChat(pet) } className="btn login-btn-primary btn-md mb-2">View Case History</button> */}
								<button onClick={ () => props.onChat(pet) } className="btn login-btn-primary btn-md mb-2 ml-3">Speak to a Vet Now!</button>
								{ pet._chat && pet._chat.length > 0 && pet._chat.map((chat, index) => {
										if(chat.notes && chat.notes.length > 0) {
											Found = true
										}
								})
								}
								{ Found === true && 
									<button key={ index } onClick={ () => props.viewNotes(pet) } className="btn login-btn-primary mt-1">View Case History</button>
								}
								{ Found = false}
							</div>
						</div>
					</div>
				);
				return (
					<div className="col-md-12 pets-list">{listPets}</div>
				);
			} else {
				return (
					<ul>No Pets List Found</ul>
				)
			}
		}

		return (
			<div className="container">
				<div className="row">
					<PetsList
						onDelete={ this.deletePet.bind(this) }
						onChat={ this.ChatVet.bind(this) }
						onChatDirectly={ this.ChatVetDirectly.bind(this) }
						petsList={ pets.petsList }
						viewNotes= { this.viewNotes.bind(this) }
					/>
					{ pets.petsList.pets && pets.petsList.pets.length > 5 &&
							<div className="row">
							<div className="col-md-12">
								<Pagination
									activePage={ this.state.activePage }
									itemsCountPerPage={ 1 }
									totalItemsCount={ this.state.totalItemsCount }
									pageRangeDisplayed={5}
									prevPageText="Previous"
									nextPageText="Next"
									onChange={ this.handlePageChange }
									innerClass="pagination"
									itemClass="page-item"
									linkClass="page-link"
								/>
							</div>
						</div>
					}
				</div>
			</div>
		);
	}
}

PetsList.propTypes = {
	getAllPets: PropTypes.func.isRequired,
	setSelectedPet: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	pets: PropTypes.object
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    pets: state.pets,
})

export  default withRouter(connect(mapStateToProps, { getAllPets, setSelectedPet, deleteSelectedPet, registerPetChat })(PetsList))