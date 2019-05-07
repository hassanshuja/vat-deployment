import React, { Component } from 'react';
// import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAllPetNotes } from '../actions/petprofile';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import Button from 'react-bootstrap/Button'

//import '../'

class PetNotes extends Component {
	constructor(props) {
		super(props);
			this.state = {
				detailNotes: null,
				showDetailNotes: false,
				errors: {}
			}
			this.backToNotesList = this.backToNotesList.bind(this)
	}

	componentDidMount() {
		if(!this.props.auth.isAuthenticated) {
			this.props.history.push('/login')
    }
    const { match: { params } } = this.props;
		this.props.getAllPetNotes(params.id)
	}

	componentWillReceiveProps(nextProps) {}

	viewNoteDetails(details) {
		this.setState({
			showDetailNotes: true,
			detailNotes: details
		})
	}

	backToNotesList() {
		this.setState({
			showDetailNotes: false,
			detailNotes: null
		})
		var petId = this.props.match.params.id
		this.props.history.push('/pets/notes/' + petId)
	}
	render() {
		const { petNotes } = this.props.pets
		const showDetailNotes = this.state.showDetailNotes
		const detailNotes = this.state.detailNotes
		function NotesList(props) {
			const list = props.petNotes;
			if (list && list.length > 0) {
				const listPets = list.map((pet, index) =>
						<div key={ index } className="row">
						{ pet.notes &&
							(
								<div className="notes-list">
								{ pet.notes.length > 100 ?
									(
										<div>
											<div className="note-title" dangerouslySetInnerHTML={{ __html: pet.notes.substring(0,100) + '...' }}></div>
											{/* <p className="note-title">{ pet.notes.substring(0,100) }</p> */}
											<button onClick={ () => props.viewNoteDetails(pet.notes) } className="btn btn-primary btn-view mt-2">View Details</button>
										</div>
									) : (
											<div>
												<div className="note-title" dangerouslySetInnerHTML={{ __html: pet.notes }}></div>
												<button onClick={ () => props.viewNoteDetails(pet.notes) } className="btn btn-primary btn-view mt-2">View Details</button>
											</div>
										)
								}
									{/* <p className="note-title">{ (pet.notes.length > 100) ? pet.notes.substring(0,100) + '...' : pet.notes }</p> */}
								</div>
							)
						}
						</div>
				);
				return (
					<ul className="col-md-12">{listPets}</ul>
				);
			} else {
				return (
					<ul>No Pets List Found</ul>
				)
			}
		}
		return (
			<div className="main-dasboard pet-edit">
				<div className="container mt-5">
					<div className="card dash-main-card">
						<div className="card-header">
							{ showDetailNotes ?
								(
									<div className="petlist-head">
										<label>Note Details</label>
										<Button
											variant="link"
											onClick={ this.backToNotesList}
										>
											<FontAwesomeIcon icon={ faArrowLeft }/> Back to Pet Notes
										</Button>
									</div>
								) : (
									<div className="petlist-head">
									<label>Case Notes</label>
									<Link to="/pets"><FontAwesomeIcon icon={ faArrowLeft } /> Back to Pets List</Link>
									</div>
								)
							}
						</div>
						<div className="card-body">
						{ showDetailNotes ?
							(
								<div>
									<div className="note-title" dangerouslySetInnerHTML={{ __html: detailNotes }}></div>
									{/* <p>{ detailNotes }</p> */}
								</div>
							) : (
								<NotesList
									petNotes= { petNotes }
									viewNoteDetails= { this.viewNoteDetails.bind(this) }
								></NotesList>
							)
						}
						</div>
					</div>
				</div>
			</div>

		)
	}
}
 
PetNotes.propTypes = {
	getAllPetNotes: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  pets: PropTypes.object
}

const mapStateToProps = (state) => ({
	auth: state.auth,
  errors: state.errors,
  pets: state.pets,
})

export default connect(mapStateToProps, { getAllPetNotes })(PetNotes)

