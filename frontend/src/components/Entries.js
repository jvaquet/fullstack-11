import React from 'react'
import Entry from './Entry'

const Entries = ({persons, handleDelete}) => {
  return (
    <>
      {persons.map(person => <Entry person={person} key={person.name} handleDelete={handleDelete} />)}
    </>
  )
}

export default Entries