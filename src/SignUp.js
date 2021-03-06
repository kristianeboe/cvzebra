import React, { Component } from 'react'
import { Segment, Container, Button, Form, Icon, Divider, Message } from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom'
import firebase, { auth, googleProvider, facebookProvider } from './firebase.js'

// const initialState = {
//   email: 'kristian.e.boe@crux.no',
//   password: 'Crux2005',
//   signUp: false,
// }

class SignUp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      signUp: false,
      redirectUpload: false,
      loading: false,
    }
    // this.state = initialState
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  googleSignIn = () => {
    auth.signInWithPopup(googleProvider).then(userSignInOperation => {
      console.log(userSignInOperation)
      if (!userSignInOperation.additionalUserInfo.isNewUser) return
      this.createUserInDatabase(userSignInOperation.user).then(() => this.setState({ redirectUpload: true }))
    })
  }

  facebookLogin = () => {
    auth.signInWithPopup(facebookProvider).then(userSignInOperation => {
      if (!userSignInOperation.additionalUserInfo.isNewUser) return
      this.createUserInDatabase(userSignInOperation.user).then(() => this.setState({ redirectUpload: true }))
    })
  }

  createUserInDatabase = user => {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection('users')
        .doc(user.uid)
        .set({
          uid: user.uid,
          displayName: user.displayName ? user.displayName : '',
          photoURL: user.photoURL ? user.photoURL : '',
          email: user.email,
        })
        .then(() => resolve())
        .catch(error => reject(error))
    })
  }
  handleSignUp = event => {
    event.preventDefault()
    this.setState({ loading: true })
    const { email, password } = this.state
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(userSignInOperation => {
        this.createUserInDatabase(userSignInOperation.user).then(() =>
          this.setState({
            email: '',
            password: '',
            redirectUpload: true,
          })
        )
      })
      .catch(function(error) {
        // Handle Errors here.
        console.log(error)
        // ...
      })
  }

  handleSignIn = event => {
    event.preventDefault()
    const { email, password } = this.state
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(userSignInOperation => {
        this.setState({
          email: '',
          password: '',
        })
      })
      .catch(function(error) {
        // Handle Errors here.
        console.log(error)
        // ...
      })
  }

  render() {
    const { signUp, redirectUpload, loading } = this.state

    if (redirectUpload) {
      return <Redirect push to="/upload" />
    }

    return (
      <Container style={{ paddingTop: '5em', width: '50em' }}>
        <Segment>
          <Button.Group size="large" style={{ display: 'flex' }}>
            <Button color="grey" onClick={this.googleSignIn}>
              {' '}
              <Icon name="google" />Google
            </Button>
            <Button.Or />
            <Button color="facebook" onClick={this.facebookLogin}>
              {' '}
              <Icon name="facebook" /> Facebook{' '}
            </Button>
          </Button.Group>
          <Divider horizontal>Or</Divider>
          <Form loading={loading}>
            <Form.Input
              fluid
              icon="mail"
              iconPosition="left"
              placeholder="E-mail address"
              name="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
            />
            {this.state.signUp ? (
              <Button onClick={this.handleSignUp} color="orange" fluid size="large">
                Sign up
              </Button>
            ) : (
              <Button onClick={this.handleSignIn} color="orange" fluid size="large">
                Log in
              </Button>
            )}
            <Message>
              {signUp ? 'Already have a user?' : 'New to us?'}{' '}
              <a onClick={() => this.setState({ signUp: !signUp })}> {signUp ? 'Log in' : 'Sign up'}</a>
            </Message>
          </Form>
        </Segment>
      </Container>
    )
  }
}

export default SignUp
