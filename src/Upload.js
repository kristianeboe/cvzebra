import React, { Component } from 'react'
import {
  Button,
  Menu,
  Icon,
  Sidebar,
  Segment,
  Header,
  Image
} from 'semantic-ui-react'
import firebase from './firebase'


class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = { messages: [] }; // <- set up react state
  }

  componentWillMount(){
    /* Create reference to messages in Firebase Database */
    let messagesRef = firebase.database().ref('messages').orderByKey().limitToLast(100);
    messagesRef.on('child_added', snapshot => {
      /* Update React state when message is added at Firebase Database */
      let message = { text: snapshot.val(), id: snapshot.key };
      this.setState({ messages: [message].concat(this.state.messages) });
    })
  }

  fileOnChange = (e) => {
    // Upload the file to firebase storage
    const file = e.target.files[0]
    const storageRef = firebase.storage().ref('coverLetters/' + file.name)

    const task = storageRef.put(file)
    const uploader = document.getElementById('uploader')
    task.on('state_changed', 
      function progress(snapshot) {
        const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        uploader.value = percentage
      }
    )
    
    // Upload the coverLeterMeta info
    const fileId = file.name
    const user = {
      uid: this.props.user.uid,
      displayName: this.props.user.displayName,
      email: this.props.user.email,
    }

    const coverLetterMeta = {
      fileId,
      user,
    }

    const coverLetterMetaKey = firebase.database().ref().child('coverLettersMeta').push().key

    const updates = {}
    updates['/coverLettersMeta/' + coverLetterMetaKey] = coverLetterMeta
    updates['/userUploads/' + user.uid + '/' + coverLetterMetaKey] = coverLetterMeta

    return firebase.database().ref().update(updates);



    // const userRef = firebase.database().ref('users/'+userId)
    // console.log(userRef)

    // const cls = {
    //   coverLetterMetaRef.key : true, 
    // // }
    // const fbUserObject = {
    //   userId: userId,
    //   cls: cls,
    // }
    // console.log(fbUserObject)
    // const fbUser = firebase.database().ref('users/'+userId).set(fbUserObject)
    // console.log(fbUser)
    // // if user exists, get clList, append clmId
    // // firebase.database().ref('users/'+userId).push(this.props.user)
  }

  
  render() {
    return (
      <Segment raised className="Upload">
        <div>
          <progress value="0" max="100" id="uploader">0%</progress>
        </div>
        <div>
          <input type="file" id="fileButton" onChange={this.fileOnChange} />
        </div>
      </Segment>
    )
  }
}

export default Upload;