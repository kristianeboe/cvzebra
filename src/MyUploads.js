import React, { Component } from 'react'
import {
  Button,
  Menu,
  Icon,
  Sidebar,
  Segment,
  Header,
  Image,
  Input
} from 'semantic-ui-react'
import Download from './Download'
import firebase from './firebase'

class MyUploads extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      fileNames: [],
    };
  }

  componentWillMount() {
    /* Create reference to messages in Firebase Database */
    let userUploadsRef = firebase.database().ref('userUploads/'+'cCIO1E0NEUWst5efPjD0AnLOGYH2').orderByKey()
    userUploadsRef.once('value').then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const fileName = childSnapshot.child('fileId').val()
        this.setState({
          fileNames: this.state.fileNames.concat(fileName)
        })
      })
    })
  }

  render() {

    // if (this.state.user) {
    //   fileNames = firebase.database().ref().child('userUploads/' + user.uid).on('value').then(function (snapshot) {
    //     let fileNames = []
    //     for (let cl in snapshot.val()) {
    //       console.log(cl)
    //       fileNames.concat(cl)
    //     }
    //     console.log(fileNames)
    //     return fileNames
    //   });
    // }
    // console.log(user)
    // console.log(fileNames)

    return (
      <Segment raised className="MyUploads">

        {this.state.fileNames.map((fileName) => {
          return (
            <Segment>
              {fileName}
            </Segment>
          )
        })}
      </Segment>
    )
  }
}


export default MyUploads