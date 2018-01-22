import React, { Component } from 'react';
import { Sidebar, Segment, Image, Button } from 'semantic-ui-react'
import './App.css';
import AppHeader from './AppHeader';
// import Authentication from './Authentication';
import firebase, { auth, provider } from './firebase.js';
import Landing from './Landing';
import MyUploads from './MyUploads'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      downloadVisible: false,
      uploadVisible: false,
      user: null,
    };

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

  toggleVisibility = () => this.setState({ visible: !this.state.visible })

  toggleDownload = () => {
    if (this.state.uploadVisible) {
      this.setState({ uploadVisible: false })
    }
    this.setState({ downloadVisible: !this.state.downloadVisible })
  }

  toggleUpload = () => {
    if (this.state.downloadVisible) {
      this.setState({ downloadVisible: false })
    }
    this.setState({ uploadVisible: !this.state.uploadVisible })
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
    const { visible } = this.state
    return (
      <div className="App">
        {/* <Authentication user={this.state.user} /> */}
        <Sidebar.Pushable as={Segment} className="AppContent" >
          <AppHeader toggleVisibility={this.toggleVisibility} visible={visible} />
          <Sidebar.Pusher onClick={() => this.setState({ visible: false })} >
        {this.state.user ?
            <Button onClick={this.logout}>Log Out</Button>
            :
            <Button onClick={this.login}>Log In</Button>
        }
            <Landing
              h1_content='Keen på jobb?'
              h3_content='Kjøp og selg cover letters'
              h2_content=''
              backgroundImage='url("/assets/images/letter.jpg")'
              full_page
              toggleDownload={this.toggleDownload}
              toggleUpload={this.toggleUpload}
              downloadVisible={this.state.downloadVisible}
              uploadVisible={this.state.uploadVisible}
              user={this.state.user}
            />
          </Sidebar.Pusher>
        </Sidebar.Pushable>
        <MyUploads user={this.state.user} />
      </div>
    );
  }
}

export default App;
