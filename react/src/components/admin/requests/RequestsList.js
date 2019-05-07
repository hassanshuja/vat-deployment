import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SideBar from '../SideBar';
import { getAllRequests, updateRequestStatus, getRequestDetails } from '../../../actions/admin/requests';
import RequestListElement from './RequestListElement';
import RequestDetails from './RequestDetails';
import CaseNotes from './CaseNotes';
import RequestHelp from '../../requestHelp'


class RequestList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showChatDialog: false
    }
    this.acceptRequest = this.acceptRequest.bind(this);
  }

  componentDidMount() {
		if(!this.props.auth.isAuthenticated && this.props.auth.roles !== 'admin') {
			this.props.history.push('/login');
    }
    this.props.getAllRequests()
  }

  acceptRequest (user_id, req_id){
    this.setState({ showChatDialog: true })
    this.clickChild(user_id)
    var form = new FormData();
    form.append('status', 'accepted');
    form.append('id', req_id);
    this.props.getRequestDetails(req_id)
    this.props.updateRequestStatus(form, user_id)
    this.props.getAllRequests()
  }

  declineRequest(id) {}
  
  componentWillReceiveProps(nextProps) {}

  render() { 
    const  { requestList, totalpage, requestDetails } = this.props.requests;
    // const { showChatDialog } = this.state
    return ( 
      <div>
        <div className="d-flex" id="wrapper">
          <SideBar />
          <div id="page-content-wrapper">
            <div className="container-fluid request-help">
              <div style={{display: this.state.showChatDialog ? 'block' : 'none' }}>
                <div className="row">
                  <div className="col-md-6">
                    <RequestHelp setClick={click => this.clickChild = click} />
                  </div>
                  <div className="col-md-6 notes pt-3">
                    <CaseNotes requestDetails={requestDetails}></CaseNotes>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-md-12">
                    {requestDetails && 
                      (
                        <RequestDetails requestDetails={requestDetails} />
                      )
                    }
                  </div>
                </div>
              </div>
              <div style={{display: this.state.showChatDialog ? 'none' : 'block' }}>
                <h1 className="mt-4">Request List</h1>
                <div className=" mt-5">
                  <div className="requests">
                  { requestList.length > 0 ?
                    (
                      <table className="table table-bordered table-hover bg-white" width="100%">
                        <thead>
                          <tr>
                            <th>Requested By</th>
                            <th>Pet Name</th>
                            <th>Problem</th>
                            <th>Problem Duration</th>
                            <th>Eating</th>
                            <th>Weight</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                      {requestList.length > 0 && requestList.map((request, index) => {
                        return(
                          <RequestListElement 
                            acceptRequest={ this.acceptRequest } 
                            declineRequest={this.declineRequest}
                            index={index} 
                            key={index} 
                            request={request} 
                          />
                        )
                          }) 
                      }
                      </tbody>
                      </table>
                    ) : (
                      <h5>No Pending Requests Found</h5>
                    )
                  }
                  </div>
                  { requestList.length > 0 &&
                    <div className="card dash-main-card">
                      {
                        totalpage !== null && 
                        <div>
                          {Array.from({ length: totalpage }, (v, k) => <button key={k+1}>{k+1}</button>)}
                        </div>
                      }
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
     );
  }
}
 
RequestList.propTypes = {
  getAllRequests: PropTypes.func.isRequired,
  requests: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  requests: state.requests,
  auth: state.auth,
  errors: state.errors
})

export  default connect(mapStateToProps, { getAllRequests, updateRequestStatus, getRequestDetails })(RequestList)
