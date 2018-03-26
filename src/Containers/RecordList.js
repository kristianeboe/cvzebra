import React from 'react'
import { List, Icon, Checkbox } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const RecordList = props => {
  const { recordDocs, size, showCompany } = props

  return (
    <List selection divided verticalAlign="middle" size={size ? size : 'medium'}>
      {recordDocs.map(record => {
        const recordData = record.data()
        return (
          //onClick={(e, data) => this.onClick(e, data, record.id)}
          <List.Item key={record.id}>
            <Link to={'/company/' + recordData.company + '/record/' + record.id}>
              {/* <Image avatar src='/assets/images/avatar/small/helen.jpg' /> */}
              <List.Content>
                <List.Header>
                  {showCompany && recordData.companyName + ', '} {recordData.gender}, {recordData.age} år gammel, gikk{' '}
                  {recordData.studyYear} klasse på {recordData.studyProgramme}, {recordData.university}{' '}
                </List.Header>

                <Checkbox as="p" label="Fikk intervju" readOnly checked={recordData.gotInterview} disabled />
                <Checkbox as="p" label="Fikk jobb" readOnly checked={recordData.gotJob} disabled />

                <p>
                  Lastet opp <b>{recordData.timeOfUpload.toDateString()}</b>
                </p>
              </List.Content>
            </Link>
          </List.Item>
        )
      })}
    </List>
  )
}

export default RecordList
