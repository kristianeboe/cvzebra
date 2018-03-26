import React, { Component } from 'react'
import { Menu, Container, Modal, Header, Button, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import firebase from './firebase'
import SignUp from './SignUp'

class AppHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
    }
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user })
      } else {
        this.setState({ user })
      }
    })
  }

  logout = () => {
    firebase
      .auth()
      .signOut()
      .then(function() {
        // Sign-out successful.
      })
      .catch(function(error) {
        console.log(error)
        // An error happened.
      })
  }

  render() {
    return (
      <Menu fixed="top" inverted>
        <Link to="/">
          <Menu.Item header>CV Zebra</Menu.Item>
        </Link>
        <Menu.Menu position="right">
          {this.state.user ? (
            <Link to="/">
              <Menu.Item onClick={this.logout}>
                <Icon name="log out" />
                Log out
              </Menu.Item>
            </Link>
          ) : (
            <Link to="/sign-up">
              <Menu.Item>
                <Icon name="sign in" />
                Log in
              </Menu.Item>
            </Link>
          )}
          {this.state.user ? (
            <Link to="/upload">
              <Menu.Item>
                <Icon name="upload" />
                Upload CV & Cover Letter
              </Menu.Item>
            </Link>
          ) : (
            <Link to="/sign-up">
              <Menu.Item>
                <Icon name="upload" />
                Upload CV & Cover Letter
              </Menu.Item>
            </Link>
          )}
        </Menu.Menu>
      </Menu>
    )
  }
}

export default AppHeader
