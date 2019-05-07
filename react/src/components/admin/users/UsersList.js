import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SideBar from '../SideBar';
import { getAllUsers, deleteSelectedUser } from '../../../actions/admin/userActions';
import UserListElement from './UserListElement';
import Pagination from "react-js-pagination";
import { withRouter } from 'react-router'
import Swal from 'sweetalert2'
import MediaHandler from '../../MediaHandler'
class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: null,
			totalItemsCount: null
    }
    this.handlePageChange = this.handlePageChange.bind(this)
    this.editUser = this.editUser.bind(this)
    this.deleteUser = this.deleteUser.bind(this)
		this.mediaHandler = new MediaHandler();
  }
  
  handlePageChange(pageNumber) {
		this.props.getAllUsers(pageNumber)
  }
  
  componentDidMount() {
		if(!this.props.auth.isAuthenticated && this.props.auth.roles !== 'admin') {
			this.props.history.push('/login');
    }
    this.props.getAllUsers(1)
    this.mediaHandler.getPermissions()
			.then((stream) => {
        
				try {
					var srcObject = stream;
				} catch (e) {
					var srcObject  = window.URL.createObjectURL(stream);
        }
        
        var tracks = srcObject.getTracks();  // if only one media track
        console.log(tracks)
        tracks.forEach(function(track) {
          track.stop();
        });
      
        srcObject = null;
      })
  }
  
  componentWillReceiveProps(props) {
		if (props) {
			var currentPage = props.users.userList.current
			var totalPages = props.users.userList.pages
			if (currentPage && totalPages) {
				this.setState({
					activePage: currentPage,
					totalItemsCount: totalPages
				})
			}
		}
  }
  
  editUser(id) {
    this.props.history.push('user/'+id+'/edit')
  }

  deleteUser(user) {
    Swal.fire({
			title: 'Delete ' + user.name,
			text: "This will delete Pets, Notes of "+ user.name + ".You won't be able to revert this!",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
			if (result.value) {
				var form = new FormData();
				form.append('id', user._id);
				this.props.deleteSelectedUser(form, this.props.history)
				/********** GET PETS LIST **********/
				this.props.getAllUsers(1)
			}
		})
  }
  
  render() { 
    const { users } = this.props
    function UserList(props){
      const users  = props.users.users
      if (users && users.length > 0) {
        const listUsers = users.map((user,index) => {
          return (
            <UserListElement
              editUser={(id) => props.editUser(id) } 
              deleteUser={(user) => props.deleteUser(user) }
              index={ index }
              key={ index }
              user={ user }
            />
          )
        });
        return (
          <table className="table table-bordered table-hover bg-white" width="100%">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            { listUsers }  
            </tbody>
            <tfoot>
            </tfoot>
          </table>
        )
        } else {
          return (
            <table className="table table-bordered table-hover bg-white" width="100%">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
              <tr>
                <td className="text-center" colSpan="5">No User Found</td>
              </tr>  
              </tbody>
            </table>
          )
        }
    }
    return ( 
      <div>
        <div className="d-flex" id="wrapper">
          <SideBar />
          <div id="page-content-wrapper">
            <div className="container-fluid">
              <h1 className="mt-4">User List</h1>
               <div className="">
                <div className=" mt-5">
                <UserList
                  users={ users.userList }
                  deleteUser={ this.deleteUser }
                  editUser={ this.editUser }
                />
      					{ users.userList.users && users.userList.users.length > 15 &&
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
 
UserList.propTypes = {
  getAllUsers: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  users: state.users,
  auth: state.auth,
  errors: state.errors
})

export  default withRouter(connect(mapStateToProps, { getAllUsers, deleteSelectedUser })(UserList))
