import React, { Component } from 'react'
import FormField, {
  List,
  Container,
  Dropdown,
  Button,
  Menu,
  Icon,
  Sidebar,
  Segment,
  Header,
  Image,
  Form,
  Grid,
  Checkbox,
  Message,
} from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom'
import firebase, { auth } from './firebase'
import SignUp from './SignUp'
import sanitize from 'sanitize-filename'
import RecordList from './Containers/RecordList'

const genderOptions = [{ key: 'm', text: 'Gutt', value: 'Gutt' }, { key: 'f', text: 'Jente', value: 'Jente' }]

const initialRecordFormState = {
  company: '',
  age: '',
  gender: '',
  studyProgramme: '',
  studyYear: '',
  university: '',
  gotInterview: false,
  gotJob: false,
}

class Upload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      userFormLoading: true,
      infoLoading: true,
      recordsLoading: true,
      displayName: '',
      email: '',
      photoURL: '',
      age: '',
      gender: '',
      studyProgramme: '',
      studyYear: '',
      university: '',
      userFormSuccess: false,
      availableCompanies: [],
      recordForm: initialRecordFormState,
      records: null,
      recordsExists: null,
      companyLoading: true,
      recordSubmitLoading: false,
      recordUploadSuccess: false,
      cvMeta: {},
      coverLetterMeta: {},
    }
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })
  handleRecordChange = (e, { name, value }) =>
    this.setState({ recordForm: { ...this.state.recordForm, [name]: value } })

  handleAddition = (e, { value }) => {
    this.setState({ companyLoading: true })
    firebase
      .firestore()
      .collection('companies')
      .add({
        companyName: value,
      })
      .then(doc =>
        this.setState({
          company: doc.id,
          availableCompanies: [...this.state.availableCompanies, { text: value, value: doc.id }],
          companyLoading: false,
        })
      )
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      firebase
        .firestore()
        .collection('users')
        .doc(user.uid)
        .get()
        .then(doc => {
          const userData = doc.data()
          this.setState({
            user,
            userFormLoading: false,
            displayName: user.displayName ? user.displayName : '',
            photoURL: user.photoURL ? user.photoURL : '',
            age: userData.age ? userData.age : '',
            gender: userData.gender ? userData.gender : '',
            studyProgramme: userData.studyProgramme ? userData.studyProgramme : '',
            studyYear: userData.studyYear ? userData.studyYear : '',
            university: userData.university ? userData.university : '',
          })
          return userData
        })
        .then(userData => {
          const recordsObject = userData.records
          if (recordsObject) {
            this.setState({ recordsExists: true, recordsLoading: true })
            const promises = []
            for (const companyId in recordsObject) {
              const recordId = recordsObject[companyId]
              promises.push(
                firebase
                  .firestore()
                  .collection('companies')
                  .doc(companyId)
                  .collection('records')
                  .doc(recordId)
                  .get()
              )
            }
            Promise.all(promises).then(results => {
              const records = []
              results.forEach(record => {
                records.push(record)
              })
              this.setState({ records, recordsLoading: false })
            })
          }
        })
    })

    firebase
      .firestore()
      .collection('companies')
      .get()
      .then(snapshot => {
        let availableCompanies = []
        snapshot.forEach(doc => {
          const company = doc.data()
          availableCompanies.push({
            key: doc.id,
            value: doc.id,
            text: company.companyName,
            img: company.logo,
          })
        })
        this.setState({ availableCompanies, companyLoading: false })
      })
  }

  fileOnChange = e => {
    // Upload the file to firebase storage
    const id = e.target.id
    const file = e.target.files[0]

    const sanitizedFileName = sanitize(file.name).replace(/ /g, '_')
    const storageRef = firebase.storage().ref(id + '/' + sanitizedFileName)

    const task = storageRef.put(file)
    const uploader = document.getElementById(id + 'Uploader')
    task.on('state_changed', function progress(snapshot) {
      const percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100
      uploader.value = percentage
    })

    // Upload the coverLetterMeta info
    const fileId = storageRef.fullPath

    const fileMeta = {
      fileId,
      sanitizedFileName,
    }

    const stateMeta = id == 'CVs' ? 'cvMeta' : 'coverLetterMeta'
    this.setState({
      [stateMeta]: fileMeta,
    })
  }

  uploadARecordForSale = () => {
    console.log(this.state)

    const { user, availableCompanies, company, cvMeta, coverLetterMeta } = this.state
    const { age, gender, studyProgramme, studyYear, university, gotInterview, gotJob } = this.state.recordForm
    const uid = user.uid
    const selectedCompany = availableCompanies.find(c => c.value == this.state.company)
    const companyName = selectedCompany ? selectedCompany.text : false
    if (!companyName) return // should set error on form

    // const fileIds
    const timeOfUpload = new Date()

    console.log(this.state)

    this.setState({ recordSubmitLoading: true })

    firebase
      .firestore()
      .collection('companies')
      .doc(company)
      .collection('records')
      .add({
        age,
        gender,
        studyProgramme,
        studyYear,
        university,
        gotInterview,
        gotJob,
        company,
        cvMeta,
        coverLetterMeta,
        timeOfUpload,
        uid,
        companyName,
      })
      .then(doc => {
        doc.get().then(recordDoc => {
          const records = this.state.records ? this.state.records : []
          records.push(recordDoc)
          this.setState({
            records,
            recordSubmitLoading: false,
            recordUploadSuccess: true,
            recordForm: initialRecordFormState,
            company: '',
            cvMeta: {},
            coverLetterMeta: {},
          })
        })

        const updateString = 'records.' + company
        firebase
          .firestore()
          .collection('users')
          .doc(user.uid)
          .update({
            [updateString]: doc.id,
          })
      })
  }

  handleInfoSubmit = () => {
    const { user, age, gender, studyProgramme, studyYear, university } = this.state
    this.setState({ userFormLoading: true })
    firebase
      .firestore()
      .collection('users')
      .doc(user.uid)
      .update({
        age,
        gender,
        studyProgramme,
        studyYear,
        university,
      })
      .then(() => this.setState({ userFormSuccess: true, userFormLoading: false }))
  }

  fillInRecord = () => {
    const { age, gender, studyProgramme, studyYear, university, company, cvMeta, coverLetterMeta } = this.state
    this.setState({
      recordForm: {
        ...this.state.recordForm,
        age,
        gender,
        studyProgramme,
        studyYear,
        university,
      },
    })
  }

  render() {
    console.log(this.state)

    const {
      user,
      displayName,
      email,
      photoURL,
      age,
      gender,
      university,
      studyProgramme,
      studyYear,
      userFormLoading,
      userFormSuccess,
      recordsExists,
    } = this.state

    if (!user) <Redirect push to="sign-up" companyName={this.state.selectedCompany} />

    const upperGridWidth = recordsExists ? 10 : 16

    return (
      // <div style={{
      //   display: 'flex',
      //   flexDirection: 'column',
      //   height: '100vh',
      //   margin: '0',
      //   justifyContent: 'center',
      //   alignItems: 'center',
      // }}>
      <Container style={{ paddingTop: '10vh', paddingBottom: '10vh' }}>
        <Grid stackable>
          <Grid.Column width={upperGridWidth}>
            <Segment raised className="you">
              <Form loading={userFormLoading} success={userFormSuccess}>
                <Grid columns="equal" stackable>
                  <Grid.Column>
                    <h1>Her er deg i dag</h1>
                    <Form.Input fluid label="Name" placeholder="Name" name="name" value={displayName} />
                    <Form.Group widths="equal">
                      <Form.Input
                        fluid
                        label="Alder"
                        placeholder="Alder"
                        name="age"
                        value={age}
                        onChange={this.handleChange}
                      />
                      <Form.Select
                        fluid
                        label="Kjønn"
                        options={genderOptions}
                        placeholder="Kjønn"
                        value={gender}
                        name="gender"
                        onChange={this.handleChange}
                      />
                    </Form.Group>
                    <Form.Group widths="equal">
                      <Form.Input
                        fluid
                        label="Studie"
                        placeholder="Studie"
                        name="studyProgramme"
                        value={studyProgramme}
                        onChange={this.handleChange}
                      />
                      <Form.Input
                        fluid
                        label="Klassetrinn"
                        placeholder="Klassetrinn"
                        name="studyYear"
                        value={studyYear}
                        onChange={this.handleChange}
                      />
                      <Form.Input
                        fluid
                        label="Universitet"
                        placeholder="Universitet"
                        name="university"
                        value={university}
                        onChange={this.handleChange}
                      />
                    </Form.Group>
                    <Form.Button onClick={this.handleInfoSubmit}>Save</Form.Button>
                  </Grid.Column>
                  <Grid.Column
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Image src={photoURL} size="medium" circular />
                    {/* <Form.Button>{photoURL ? 'Change profile image' : 'Upload profile image'}</Form.Button> */}
                  </Grid.Column>
                </Grid>
                <Message success header="Profil oppdatert" content="Chill!" />
              </Form>
            </Segment>
          </Grid.Column>
          {this.state.recordsExists && (
            <Grid.Column width={6}>
              <Segment loading={this.state.recordsLoading}>
                <h1>Mine opplastninger</h1>
                {this.state.records && <RecordList recordDocs={this.state.records} showCompany={true} />}
              </Segment>
            </Grid.Column>
          )}
        </Grid>

        <Segment raised className="Upload">
          <h2>Hvem var du da du søkte den jobben?</h2>
          <Button onClick={this.fillInRecord}>Samme som over</Button>
          <Form
            onSubmit={this.uploadARecordForSale}
            loading={this.state.recordSubmitLoading}
            success={this.state.recordUploadSuccess}
          >
            <Form.Field required>
              <Dropdown
                name="company"
                disabled={this.state.companyLoading}
                loading={this.state.companyLoading}
                options={this.state.availableCompanies}
                placeholder="Velg et selskap, eller legg til et nytt et"
                search
                selection
                fluid
                allowAdditions
                value={this.state.company}
                onAddItem={this.handleAddition}
                onChange={this.handleChange}
              />
            </Form.Field>
            <Form.Group widths="equal">
              <Form.Input
                required
                fluid
                label="Alder"
                placeholder="Alder"
                name="age"
                value={this.state.recordForm.age}
                onChange={this.handleRecordChange}
              />
              <Form.Select
                required
                fluid
                label="Kjønn"
                options={genderOptions}
                placeholder="Kjønn"
                value={this.state.recordForm.gender}
                name="gender"
                onChange={this.handleRecordChange}
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Input
                fluid
                required
                label="Studie"
                placeholder="Studie"
                name="studyProgramme"
                value={this.state.recordForm.studyProgramme}
                onChange={this.handleRecordChange}
              />
              <Form.Input
                fluid
                required
                label="Klassetrinn"
                placeholder="Klassetrinn"
                name="studyYear"
                value={this.state.recordForm.studyYear}
                onChange={this.handleRecordChange}
              />
              <Form.Input
                fluid
                required
                label="Universitet"
                placeholder="Universitet"
                name="university"
                value={this.state.recordForm.university}
                onChange={this.handleRecordChange}
              />
            </Form.Group>
            <Form.Field required>
              <Checkbox
                label="Fikk intervju"
                onChange={() =>
                  this.setState({
                    recordForm: { ...this.state.recordForm, gotInterview: !this.state.recordForm.gotInterview },
                  })
                }
                checked={this.state.recordForm.gotInterview}
              />
            </Form.Field>
            <Form.Field required>
              <Checkbox
                label="Fikk jobben"
                onChange={() =>
                  this.setState({ recordForm: { ...this.state.recordForm, gotJob: !this.state.recordForm.gotJob } })
                }
                checked={this.state.recordForm.gotJob}
              />
            </Form.Field>
            <Grid columns="equal">
              <Grid.Column>
                <Segment>
                  <h1>CV</h1>
                  <progress style={{ width: '-webkit-fill-available' }} value="0" max="100" id="CVsUploader">
                    0%
                  </progress>
                  <input type="file" id="CVs" onChange={this.fileOnChange} />
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment>
                  <h1>Søknad</h1>
                  <progress style={{ width: '-webkit-fill-available' }} value="0" max="100" id="coverLettersUploader">
                    0%
                  </progress>
                  <input type="file" id="coverLetters" onChange={this.fileOnChange} />
                </Segment>
              </Grid.Column>
            </Grid>
            <Button type="submit">Upload a record for sale</Button>
            <Message success header="Opplastning vellykket" content="Let the money flow through you" />
          </Form>
        </Segment>
      </Container>
      // </div>
    )
  }
}

export default Upload
