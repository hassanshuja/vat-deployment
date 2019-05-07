import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'

class UserListElement extends Component {
  constructor(props) {
    super(props);
    this.state = {}
    // this.editUser = this.editUser.bind(this)
    // this.deleteUser = this.deleteUser.bind(this)
  }

  editUser(userId) {}

  render() { 
    const { index, user} = this.props
    return ( 
      <tr className="user-row" key={index}>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>{user.role}</td>
        <td>
          <button className="btn-edit" onClick={() => this.props.editUser(user._id)}>
            <FontAwesomeIcon icon={ faEdit }/>
          </button>
          <button className="btn-delete" onClick={() => this.props.deleteUser(user)}>
            <FontAwesomeIcon icon={ faTrash }/>
          </button>
        </td>
      </tr>
     );
  }
}
 
export default UserListElement;