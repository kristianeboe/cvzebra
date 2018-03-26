import React, { Component } from 'react'
import { withRouter, Route, Redirect } from 'react-router-dom'
import { Button, Input, Container, Header, Icon, Segment, Item, Dropdown } from 'semantic-ui-react'
import letterImage from './assets/letter.jpg'
import About from './About';
import firebase, { auth, provider } from './firebase.js';

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedCompany: null,
      redirect: false,
      companyOptions: [],
      loading: true,
    }
  }

  componentDidMount() {
    firebase.firestore().collection('companies').get().then(snapshot => {
      let companyOptions = []
      snapshot.forEach(doc => {
        const company = doc.data()
        companyOptions.push({
          key: doc.id,
          text: company.companyName,
          value: doc.id,
          img: company.logo,
        })
      })
      this.setState({ companyOptions, loading: false })
    })
  }

  handleClose = (event, data) => {
    if (this.state.selectedCompany) {
      this.setState({
        redirect: true,
      })
    }
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  render() {

    if (this.state.redirect) {
      console.log(this.state.selectedCompany)
      const { selectedCompany, companyOptions } = this.state
      const companyName = companyOptions.find(c => c.key == this.state.selectedCompany).text

      return <Redirect push to={{
        pathname: "/company/" + selectedCompany,
        state: { companyName: companyName }
      }} />
    }

    return (
      <div className="home">
        <Segment
          inverted
          style={{
            display: 'flex',
            height: '100vh',
            margin: '0',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center center',
            backgroundImage: 'url("/assets/images/letter-min.jpg")',
            backgroundSize: 'cover',
            boxShadow: 'inset 0 0 0 2000px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{ textAlign: 'center' }} >
            <h1>Hvor vil du ha jobb?</h1>
            {/* <Dropdown loading={this.state.loading} name="selectedCompany" search selection options={this.state.companyOptions} style={{ minWidth: '50vw' }} value={this.state.selectedCompany} onChange={this.handleChange} onClose={this.handleClose} placeholder='Velg et selskap' /> */}
            <Dropdown
              loading={this.state.loading}
              name="selectedCompany"
              options={this.state.companyOptions}
              placeholder='Velg et selskap'
              search
              selection
              style={{ minWidth: '50vw' }}
              value={this.state.selectedCompany}
              onChange={this.handleChange}
              onClose={this.handleClose}
            />
          </div>
        </Segment>
        <About />
        <Segment
          inverted
          style={{
            display: 'flex',
            height: '20vh',
            margin: '0',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div>
            <h1>Footer</h1>
          </div>
        </Segment>
      </div>
    )
  }
}

export default Home