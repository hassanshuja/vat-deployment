// App.js

import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import jwt_decode from 'jwt-decode';
import setAuthToken from './setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authentication'
import './App.css'
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';

import 'bootstrap/dist/css/bootstrap.min.css';
import CreateProfile from './components/CreateProfile';
import RequestHelp from './components/requestHelp';
import PetsList from './components/PetsList';
import PetRegister from './components/PetRegister';
import UserLIst from './components/admin/users/UsersList';
import EditUser from './components/admin/users/EditUser';
import RequestLIst from './components/admin/requests/RequestsList';
import EditPet from './components/EditPet';
import PetNotes from './components/PetNotes';

if(localStorage.jwtToken) {
    setAuthToken(localStorage.jwtToken);
    const decoded = jwt_decode(localStorage.jwtToken);
    store.dispatch(setCurrentUser(decoded));
  
    const currentTime = Date.now() / 1000;
    if(decoded.exp < currentTime) {
      store.dispatch(logoutUser());
      window.location.href = '/login'
    }
  }

class Routes extends Component {

  render() {
    return (
      <Provider store = { store } >
        <Router>
          <div>
            <Navbar />
            <Route exact path="/" component={ Home } />
            <Route exact path="/dashboard" component={ Home } />
            <Route exact path="/requestlist" component={ RequestLIst } />
            <Route exact path="/userlist" component={ UserLIst } />
            <Route path="/user/:id/edit" component={ EditUser } />
            <Route exact path="/CreateProfile" component={ CreateProfile } />
            <Route exact path="/requesthelp" component={ RequestHelp } />
            <Route exact path="/pets" component={ PetsList } />
            <Route exact path="/petregister" component= { PetRegister} />
            <Route path="/pet/:id/edit" component={ EditPet } />
            <Route path="/pets/notes/:id" component={ PetNotes } />
              <div className="container">
                <Route exact path="/register" component={ Register } />
                <Route exact path="/login" component={ Login } />
              </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default Routes;