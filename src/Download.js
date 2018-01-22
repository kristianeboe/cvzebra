import React, { Component } from 'react'
import {
  Button,
  Menu,
  Icon,
  Sidebar,
  Segment,
  Header,
  Image,
  Input,
} from 'semantic-ui-react'
import firebase from './firebase'
import DownloadFile from './DownloadFile'


class Download extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      fileNames: [],
      filter: '',
    };
    this.download = this.download.bind(this)
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  componentWillMount(){
    /* Create reference to messages in Firebase Database */
    let coverLettersMetaRef = firebase.database().ref('coverLettersMeta').orderByKey()
    coverLettersMetaRef.once('value').then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const fileName = childSnapshot.val()
        this.setState({
          fileNames: this.state.fileNames.concat(fileName)
        })
      })
    })
    
  }

  download() {
    const fileName = "2017 Resume Kristian Elset Boe.pdf"
    const storageRef = firebase.storage().ref('coverLetters/'+fileName)
    storageRef.getDownloadURL().then((url) => {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function(event) {
        var blob = xhr.response;
        var link = document.createElement('a');
        link.href = url;
        link.download = 'file.pdf';
        link.dispatchEvent(new MouseEvent('click'));
      };
      xhr.open('GET', url);
      xhr.send();
    

    
    }).catch(function(error) {
      switch (error.code) {
        case 'storage/object_not_found':
          console.log("// File doesn't exist")
          break;
    
        case 'storage/unauthorized':
          console.log("// User doesn't have permission to access the object")
          break;
    
        case 'storage/canceled':
          console.log("// User canceled the upload")
          break;
    
        case 'storage/unknown':
          console.log("// Unknown error occurred, inspect the server response")
          break;
      }
    });
  }
  
  render() {
    const {fileNames, filter} = this.state

    
    return (
      <Segment raised className="Download">
        <Input placeholder='Search...' name="filter" value={filter} onChange={this.handleChange}/>
        {fileNames.filter((fileName) => fileName.includes(filter)).map((fileName) => (
          <Segment onClick={this.download}>
            {fileName}
          </Segment>
        ))}
      </Segment> 
    )
  }
}

export default Download;