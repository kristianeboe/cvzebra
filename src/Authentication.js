import React, { Component } from 'react';
import { Button } from 'semantic-ui-react'
import firebase, { auth, provider } from './firebase.js';


class Authentication extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }
  
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      }
    });
  }

  logout() {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null
        });
      });
  }
  login() {
    auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        this.setState({
          user
        });
      });
  }

  render() {
    console.log(this.state.user)
      return (<div>{
      this.state.user ?
        <Button onClick={this.logout}>Log Out</Button>
        :
        <Button onClick={this.login}>Log In</Button>
    }</div>)
  }
}

export default Authentication