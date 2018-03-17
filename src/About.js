import React from 'react'
import { Grid, Segment, Container } from 'semantic-ui-react'

const About = (props) => (
  <Container>
    <Grid columns='equal' style={{textAlign:'center', padding: '2em'}} >
      <Grid.Column>
        <h2>Har ikke jobb</h2>
        <Segment content="Finn selskap" />
        <Segment content="Velg profil" />
        <Segment content="Registrer deg og kjøp" />
      </Grid.Column>
      <Grid.Column>
        <h2>Har jobb</h2>
        <Segment content="Registrer deg" />
        <Segment content="Last opp dokumenter" />
        <Segment content="Profit" />
      </Grid.Column>
    </Grid>
  </Container>
)


export default About