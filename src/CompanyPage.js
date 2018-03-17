import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom'
import { Checkbox, Segment, List, Container, Dimmer, Loader, Button, Sidebar } from 'semantic-ui-react'
import firebase, { auth } from './firebase.js'


class CompanyPage extends Component {

  constructor(props) {
    super(props);
    const { match, location } = props
    this.unsubscribe = null
    console.log(props)

    this.state = {
      user: null,
      records: [],
      companyId: match.params.comapnyId,
      companyName: location.state.companyName,
      sortByDate: true,
      loading: true,
      redirect: false,
    }
  }

  componentDidMount() {

    console.log(this.props)
    const { companyId } = this.state
    //this.props.match.params.id
    // crux 8kpTDN6fkmI1JLvlRm87
    const companyRef = firebase.firestore().collection("companies").doc(companyId)
    if (!this.state.companyName) {
      companyRef.get().then(doc => this.setState({ companyName: doc.data().companyName }))
    }
    this.unsubscribe = companyRef.collection('records').onSnapshot((snapshot) => {
      const records = []
      snapshot.forEach((doc => {
        const record = doc.data()
        records.push({
          key: doc.id,
          doc,
          data: record
        })
      }))
      this.setState({
        records,
        loading: false,
      })
    })

  }


  componentWillUnmount() {
    this.unsubscribe();
  }

  changeSorting = (sortByDate) => {
    this.setState({ sortByDate: !sortByDate })
  }

  onClick = (e, data, recordId) => {
    this.setState({ redirect: true, recordURL: recordId })
  }

  render() {

    if (this.state.redirect) {
      return <Redirect push to={`${this.props.match.url}/${this.state.recordURL}`} />;
    }

    const { user, records, loading, companyId, sortByDate, companyName } = this.state

    return (
      <div className="company-page">
        <Container style={{ paddingTop: '5em', height: '100vh' }} >

          <h1 >{companyName}</h1>
          <div>Sort by:</div>
          <Button.Group >
            <Button positive={sortByDate} onClick={() => this.changeSorting(sortByDate)} >Date</Button>
            <Button.Or />
            <Button positive={!sortByDate} onClick={() => this.changeSorting(sortByDate)} >Match</Button>
          </Button.Group>
          <Segment >
            {loading && (
              <Dimmer active>
                <Loader />
              </Dimmer>
            )}
            <List selection divided verticalAlign='middle' size="massive" >
              {this.state.records.map((record) => (
                <List.Item key={record.key} onClick={(e, data) => this.onClick(e, data, record.key)} >
                  {/* <Image avatar src='/assets/images/avatar/small/helen.jpg' /> */}
                  <List.Content>
                    <List.Header>{record.data.gender}, {record.data.age} år gammel, gikk {record.data.studyYear} klasse på {record.data.studyProgramme}, {record.data.university} </List.Header>
                    <p>Fikk intervju: <Checkbox readOnly checked={record.data.gotInterview} disabled /> , Fikk jobb: <Checkbox readOnly checked={record.data.gotJob} disabled /></p>
                    <p>Lastet opp <b>{record.data.timeOfUpload.toDateString()}</b></p>
                  </List.Content>
                </List.Item>
              ))}
            </List>
            {/* <Button content="Load more..." /> */}
          </Segment>
          <Segment  >
            <Button content="Get matched" />
          </Segment>
          {/* <CaseList records={records} companyId={companyId} sortByDate={sortByDate} /> */}
        </Container>
      </div>)

  }
}


export default CompanyPage