import React, { Component } from 'react'
import { Button, List, Checkbox, Segment, Container, Grid } from 'semantic-ui-react'
import firebase, { auth } from './firebase'
import RecordList from './Containers/RecordList'

class Record extends Component {
  constructor(props) {
    super(props)
    const { match } = props
    this.state = {
      companyId: match.params.comapnyId,
      recordId: match.params.recordId,
      record: null,
      records: [],
      recordsLoading: true,
    }
  }

  componentDidMount() {
    console.log(this.state)
    const { companyId, recordId } = this.state
    firebase
      .firestore()
      .collection('companies')
      .doc(companyId)
      .collection('records')
      .doc(recordId)
      .get()
      .then(doc => {
        const record = doc.data()
        this.setState({ record })
        console.log(record)
        return record.uid
      })
      .then(uid => {
        firebase
          .firestore()
          .collection('users')
          .doc(uid)
          .get()
          .then(doc => {
            const userData = doc.data()
            const recordsObject = userData.records
            if (recordsObject) {
              const promises = []
              for (const companyId in recordsObject) {
                const recordId = recordsObject[companyId]
                promises.push(
                  firebase
                    .firestore()
                    .doc('companies/' + companyId + '/records/' + recordId)
                    .get()
                )
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
    const storage = firebase.storage()
    const pathReference = storage.ref('CVs/' + cvMeta.sanitizedFileName)

    this.issueDownloadRequest(pathReference)
  }

  downloadCoverLetter = () => {
    const { coverLetterMeta } = this.state.record
    const storage = firebase.storage()
    const pathReference = storage.ref('CVs/' + coverLetterMeta.sanitizedFileName)

    this.issueDownloadRequest(pathReference)
  }

  issueDownloadRequest = pathReference => {
    console.log(pathReference)
    console.log(pathReference.getDownloadURL())
    pathReference
      .getDownloadURL()
      .then(url => {
        var xhr = new XMLHttpRequest()
        xhr.responseType = 'blob'
        xhr.onload = function(event) {
          var blob = xhr.response
          var link = document.createElement('a')
          link.href = url
          link.download = 'file.pdf'
          link.dispatchEvent(new MouseEvent('click'))
        }
        xhr.open('GET', url)
        xhr.send()
      })
      .catch(function(error) {
        // Handle any errors
      })
  }

  render() {
    const { record } = this.state
    console.log(record)

    return (
      <Container
        style={{
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '10vh',
          paddingBottom: '10vh',
          margin: '0',
          justifyContent: 'center',
          // alignItems: 'center',
        }}
      >
        <Segment>
          <h1>Profil</h1>
          {record && (
            <div>
              <h2>Selskap: {record.companyName}</h2>
              <h2>
                {record.gender}, {record.age} år gammel, gikk {record.studyYear} klasse på {record.studyProgramme},{' '}
                {record.university}{' '}
              </h2>
              <p>
                Fikk intervju: <Checkbox readOnly checked={record.gotInterview} /> , Fikk jobb:{' '}
                <Checkbox readOnly checked={record.gotJob} />
              </p>
              <p>
                Lastet opp <b>{record.timeOfUpload.toDateString()}</b>
              </p>
            </div>
          )}
        </Segment>

        <Grid stackable columns="equal" style={{ textAlign: 'center' }}>
          <Grid.Column>
            <Segment>
              <h2>CV</h2>
              <Button onClick={this.downloadCV}>Download File</Button>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment>
              <h2>Søknad</h2>
              <Button onClick={this.downloadCoverLetter}>Download File</Button>
            </Segment>
          </Grid.Column>
        </Grid>
        <Segment loading={this.state.recordsLoading}>
          <h2>Andre opplastninger av denne brukeren:</h2>
          <RecordList recordDocs={this.state.records} showCompany={true} />
        </Segment>
      </Container>
    )
  }
}

export default Record
