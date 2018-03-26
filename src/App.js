import React, { Component } from 'react';
import { Sidebar, Segment, Image, Button } from 'semantic-ui-react'
import './App.css';
import AppHeader from './AppHeader';
import firebase, { auth, provider } from './firebase.js';
import Landing from './Landing';
import MyUploads from './MyUploads'
import Upload from './Upload'
import Home from './Home'
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'
import SignUp from './SignUp';
import CompanyPage from './CompanyPage';
import Record from './Record';

class App extends Component {

  render() {
    return (
      <div className="app">
        <AppHeader />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/upload" component={Upload} />
          <Route exact path="/sign-up" component={SignUp} />
          <Route exact path="/company/:comapnyId/record/:recordId" component={Record} />
          <Route exact path="/company/:comapnyId" component={CompanyPage} />
        </Switch>
        {/* <MyUploads user={this.state.user} /> */}
      </div>
    );
  }
}

export default App;
