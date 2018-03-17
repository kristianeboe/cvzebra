import React from 'react'
import {
  Button,
  Container,
  Header,
  Icon,
  Segment,
  Item,
  Dropdown,
} from 'semantic-ui-react'
import Upload from './Upload'
import Download from './Download'
import './App.css';

const Landing = (props) => {
  const { h1_content, h3_content, h2_content, backgroundImage, full_page, downloadVisible, uploadVisible, toggleDownload, toggleUpload, user } = props
  let view_height = 0
  full_page ? view_height = '100vh' : view_height = '50vh'


  const companyOptions = [
    {
      key: 'aaaaaa',
      value: 'mckinsey',
      img: '',
      text: 'McKinsey & Company'
    },
    {
      key: 'baaaaa',
      value: 'bcg',
      img: '',
      text: 'Boston Consulting Group (BCG)'
    },
    {
      key: 'caaaaa',
      value: 'netlight',
      img: '',
      text: 'Netlight'
    },
    {
      key: 'daaaaa',
      value: 'bekk',
      img: '',
      text: 'BEKK'
    }

  ]

  return (
    <Item>
      <Segment
        inverted
        textAlign='center'
        vertical
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center center',
          backgroundImage: backgroundImage,
          backgroundSize: 'cover',
          boxShadow: 'inset 0 0 0 2000px rgba(0,0,0,0.4)',
          height: view_height,
          padding: '1em 0em',
        }}
      >
        <Item.Content verticalAlign='middle'>
          <Header
            as='h1'
            content={h1_content}
            inverted
            style={{ fontSize: '3em', fontWeight: 'normal', marginBottom: 0, marginTop: '3em' }}
          />
          <Header
            as='h3'
            content={h3_content}
            inverted
            style={{ fontSize: '1em', fontWeight: 'normal' }}
          />
          <Header
            as='h2'
            content={h2_content}
            inverted
            style={{ fontSize: '1.5em', fontWeight: 'normal' }}
          />

          <Button primary size='huge' onClick={toggleDownload}>
            Kjøp cover letter
                <Icon name='right arrow' />
          </Button>
          <Button primary size='huge' onClick={toggleUpload}>
            Selg cover letter
                <Icon name='right arrow' />
          </Button>
          {downloadVisible && (
            <Download />
          )}
          {uploadVisible && (
            <Upload user={user} />
          )}
          <Dropdown placeholder='Select a company' fluid search selection >
            <Dropdown.Menu>
              {companyOptions.map(company => <Dropdown.Item key={company.value} {...company} />)}
            </Dropdown.Menu>
          </Dropdown>

        </Item.Content>

      </Segment>
    </Item>


  )
}

export default Landing;