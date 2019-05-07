import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MediaHandler from './MediaHandler';
import Pusher from 'pusher-js';
import Peer from 'simple-peer';
// import queryString from 'query-string'
// import Spinner from 'react-bootstrap/Spinner'
import { getRequestDetails } from '../actions/admin/requests'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faStop } from '@fortawesome/free-solid-svg-icons'

const APP_KEY = '92e8a4cbd51aaee54132';

class RequestHelp extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hasMedia: false,
			otherUserid: null,
			btnPause: true,
			btnResume: false,
			btnFinish: true
			// loader: false,
			// userType: null
		}
		this.mediaHandler = new MediaHandler();
		this.user = this.props.auth.user
		this.username = this.props.auth.user.name
		this.user.stream = null
			
		this.setupPusher();
		this.peers = {}
		this.callTo = this.callTo.bind(this);
		this.setupPusher = this.setupPusher.bind(this);
		this.startPeer = this.startPeer.bind(this);
		if (this.props.auth.user.role === 'admin') {
			this.props.setClick(this.callTo);
		}
		this.pauseCall = this.pauseCall.bind(this)
		this.resumeCall = this.resumeCall.bind(this)
		// this.connectedCall = this.connectedCall.bind(this)
	}

	componentWillMount() {
		this.mediaHandler.getPermissions()
			.then((stream) => {
				this.setState({hasMedia:true});
				this.user.stream = stream
				try {
					this.myVideo.srcObject = stream;
				} catch (e) {
					this.myVideo.src = window.URL.createObjectURL(stream);
				}
				this.myVideo.play();
			})
	}

	componentDidMount() {
		if(!this.props.auth.isAuthenticated) {
			this.props.history.push('/login');
		}
		
		// if(this.props.location && this.props.location.search !== undefined) {
			// const values = queryString.parse(this.props.location.search)
			// if(values.type === 'user') {
			// 	this.setState({
			// 		loader: true,
			// 		userType: 'customer'
			// 	})
			// }
			/* GET CHAT/SESSION STATUS */
			// this.props.getRequestDetails(values.session)
			// this.connectedCall()
		// }
		// this.user = this.props.auth.user
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps) {
			/* PROPS RECEIVED TO CUSTOMER FOR SESSION DETAILS */
			// if (this.state.userType === 'customer' && nextProps.requests.requestDetails) {
			// 	const details = nextProps.requests.requestDetails
			// 	if(details.status === 'accepted') {
			// 		this.setState({
			// 			loader: false
			// 		})
			// 	}
			// }
		}
	}

	connectedCall() {
		// // Pusher.logToConsole = true;
		// this.pusherTwo = new Pusher(APP_KEY, {
		// 	cluster: 'ap2'
		// });
		// this.channelTwo = this.pusherTwo.subscribe('chats-changes');
		// this.channelTwo.bind('inserted', (chat) => {
		// });
	}

	setupPusher() {
		// Pusher.logToConsole = true;
		this.pusher = new Pusher(APP_KEY, {
			authEndpoint: '/api/pusher/auth',
			cluster: 'ap2',
			auth: {
				params: {user_id: this.user.id, name : this.username},
				headers: {
					"content-type": "application/x-www-form-urlencoded",
				}
			}
		});
		this.channel = this.pusher.subscribe('presence-video-channel');
		this.channel.bind(`client-signal-${this.user.id}`, (signal) => {
			let peer = this.peers[signal.userId];
			// if peer is not already exists, we got an incoming call
			if(peer === undefined) {
				this.setState({otherUserId: signal.userId});
				peer = this.startPeer(signal.userId, false);
			}
			peer.signal(signal.data);
		});
	}

	startPeer(userId, initiator = true) {
		const peer = new Peer({
			initiator,
			stream: this.user.stream,
			trickle: false
		});
			
		peer.on('signal', (data) => {
			this.channel.trigger(`client-signal-${userId}`, {
				type: 'signal',
				userId: this.user.id,
				data: data
			});
		});

		peer.on('stream', (stream) => {
			try {
				this.userVideo.srcObject = stream;
			} catch (e) {
				this.userVideo.src = URL.createObjectURL(stream);
			}

			this.userVideo.play();
		});

		peer.on('close', () => {
			let peer = this.peers[userId];
			if(peer !== undefined) {
				peer.destroy();
			}

			this.peers[userId] = undefined;
		});
		
		return peer;
	}

	callTo(userId) {
		this.peers[userId] = this.startPeer(userId);
	}

	pauseCall() {
		this.setState({
			btnPause: false,
			btnResume: true
		})
		this.myVideo.pause()
	}
	
	resumeCall() {
		this.setState({
			btnPause: true,
			btnResume: false
		})
		this.myVideo.play()
	}

	render() { 
		const { btnPause } = this.state
		const { btnResume } = this.state
		const { btnFinish } = this.state
		// const { loader } = this.state
		// const { userType } = this.state
		return ( 
			<div className="main-dasboard">
				<div className="container mt-5">
					<div className="card dash-main-card">
						{/* { loader && userType === 'customer' &&
							<Spinner animation="grow" />
						} */}
						<div className="video-container">
							<video className="my-video" ref={(ref) => {this.myVideo = ref;}}></video>              
							<video className="user-video" ref={(ref) => {this.userVideo = ref;}}></video>
						</div>
						<div className="video-options text-center">
							<div className="container">
								{ btnPause &&
									(
										<button className="btn-custom btn-call" onClick={ this.pauseCall }>
											<span>Pause</span>
										</button>
									)
								}
								{ btnResume &&
									(
										<button className="btn-custom btn-call" onClick={ this.resumeCall }>
											<span>Resume</span>
										</button>
									)
								}
							</div>
						</div>          
					</div>
				</div>
			</div>
		);
	}
}

RequestHelp.propTypes = {
	auth: PropTypes.object.isRequired,
	requests: PropTypes.object,
	pets: PropTypes.object
}

const mapStateToProps = (state) => ({
	auth: state.auth,
	requests: state.requests,
	pets: state.pets
})

export  default connect(mapStateToProps, { getRequestDetails })(RequestHelp)