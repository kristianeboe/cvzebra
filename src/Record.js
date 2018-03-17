import React, { Component } from 'react'
import { Button, List, Checkbox, Segment, Container, Grid } from 'semantic-ui-react'
import firebase, { auth } from './firebase';

class Record extends Component {

  constructor(props) {
    super(props)
    const { match } = props
    this.state = {
      companyId: match.params.comapnyId,
      recordId: match.params.recordId,
      record: null,
      records: [],
    }
  }

  componentDidMount() {
    console.log(this.state)
    const { companyId, recordId } = this.state
    firebase.firestore().collection('companies').doc(companyId).collection('records').doc(recordId).get().then(doc => {
      const record = doc.data()
      this.setState({ record })
      console.log(record)
      return record.uid
    }).then(uid => {
      firebase.firestore().collection('users').doc(uid).get().then(doc => {
        const userData = doc.data()
        const recordsObject = userData.records
        if (recordsObject) {
          this.setState({ recordsLoading: true })
          const promises = []
          for (const companyId in recordsObject) {
            const recordId = recordsObject[companyId]
            promises.push(firebase.firestore().doc('companies/' + companyId + '/records/' + recordId).get())
          }
          Promise.all(promises).then(results => {
            const records = []
            results.forEach(record => {
              // const recordData = record.data()
              records.push(record)
            })
            console.log(records)
            this.setState({ records, recordsLoading: false })
          })
        }
      })
    })



  }

  downloadCV = () => {
    const { cvMeta } = this.state.record
    const storage = firebase.storage();
    const pathReference = storage.ref('CVs/' + cvMeta.fileName);

    this.issueDownloadRequest(pathReference)

  }

  downloadCoverLetter = () => {
    const { coverLetterMeta } = this.state.record
    const storage = firebase.storage();
    const pathReference = storage.ref('CVs/' + coverLetterMeta.fileName);

    this.issueDownloadRequest(pathReference)
  }

  issueDownloadRequest = (pathReference) => {
    pathReference.getDownloadURL().then(url => {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function (event) {
        var blob = xhr.response;
        var link = document.createElement('a');
        link.href = url;
        link.download = 'file.pdf';
        link.dispatchEvent(new MouseEvent('click'));
      };
      xhr.open('GET', url);
      xhr.send();

    }).catch(function (error) {
      // Handle any errors
    });
  }

  render() {
    const { record } = this.state
    console.log(record)

    return (
      <Container style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        margin: '0',
        justifyContent: 'center',
        // alignItems: 'center',
      }}>
        <Segment>
          <h1>Profil</h1>
          {record && (
            <div>
              <h2>Selskap: {record.comapnyId}</h2>
              <h2>{record.gender}, {record.age} år gammel, gikk {record.studyYear} klasse på {record.studyProgramme}, {record.university} </h2>
              <p>Fikk intervju: <Checkbox readOnly checked={record.gotInterview} /> , Fikk jobb: <Checkbox readOnly checked={record.gotJob} /></p>
              <p>Lastet opp <b>{record.timeOfUpload.toDateString()}</b></p>
            </div>
          )}
        </Segment>

        <Grid columns='equal' style={{ textAlign: 'center' }}>
          <Grid.Column>
            <Segment >
              <h2>CV</h2>
              <Button onClick={this.downloadCV} >Download File</Button>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment>
              <h2>Søknad</h2>
              <Button onClick={this.downloadCoverLetter} >Download File</Button>
            </Segment>
          </Grid.Column>
        </Grid>
        <Segment loading={this.state.recordsLoading} >
          <h2>Andre opplastninger av denne brukeren:</h2>
          <List selection divided verticalAlign='middle' >
              {this.state.records.filter(record => record.id != this.state.record.id).map((record) => (
                <List.Item key={record.id} onClick={(e, data) => this.onClick(e, data, record.id)} >
                  {/* <Image avatar src='/assets/images/avatar/small/helen.jpg' /> */}
                  <List.Content>
                    <List.Header>{record.data().gender}, {record.data().age} år gammel, gikk {record.data().studyYear} klasse på {record.data().studyProgramme}, {record.data().university} </List.Header>
                    <p>Fikk intervju: <Checkbox readOnly checked={record.data().gotInterview} disabled /> , Fikk jobb: <Checkbox readOnly checked={record.data().gotJob} disabled /></p>
                    <p>Lastet opp <b>{record.data().timeOfUpload.toDateString()}</b></p>
                  </List.Content>
                </List.Item>
              ))}
            </List>
        </Segment>
      </Container>
    )
  }
}

export default Record