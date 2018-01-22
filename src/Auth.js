import React, { Component } from 'react';
import { Button, Header, Image, Modal, Grid, Form, Segment, Message, Tab } from 'semantic-ui-react'
import { FirebaseAuth } from 'react-firebaseui'
import firebase from './firebase'




class Auth extends Component {
  constructor(props) {
    super(props);
    const provider = new firebase.auth.GoogleAuthProvider();
    console.log(provider)
    this.state = { 
      email: '',
      password: '',
      open: false,
      signedIn: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getUser = this.getUser.bind(this);
    this.logout = this.logout.bind(this);
    
  }

  // Configure FirebaseUI.
  uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    // Sets the `signedIn` state property to `true` once signed in.
    callbacks: {
      signInSuccess: () => {
        this.setState({signedIn: true});
        return false; // Avoid redirects after sign-in.
      }
    }
  };

  


  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  onSubmit = (event) => {
    event.preventDefault();
    const {email, password} = this.state

    this.getUser(email, password)

    this.setState({
      email: '',
      password: '',
      open: false,
    })
  }

  getUser = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
      // ...
    });
    console.log(firebase.auth())
  }

  logout = () => {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    });

    console.log(firebase.auth())
  }

  render() {
    console.log(firebase.auth())
    if(this.signedIn) return <div>Signed in</div>
    return (
      <div>
      <FirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>
      <Modal open={this.state.open} trigger={<Button onClick={() => this.setState({open: true})}>Auth</Button>}>
        <Grid
          textAlign='center'
        >
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' textAlign='center'>
              Log-in to your account
            </Header>
            <Form size='large' onSubmit={this.onSubmit}>
              <Segment stacked>
                <Form.Input
                  name='email'
                  value={this.state.email}
                  fluid
                  icon='user'
                  iconPosition='left'
                  placeholder='E-mail address'
                  onChange={this.handleChange}
                />
                <Form.Input
                  name='password'
                  value={this.state.password}
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='Password'
                  type='password'
                  onChange={this.handleChange}
                />
                <Button type='submit' color='teal' fluid size='large'>Log in</Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </Modal>
      <Button onClick={this.logout}>Log out</Button>
      </div>
    )
  }
}

export default Auth;