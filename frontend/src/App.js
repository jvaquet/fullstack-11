import React, { useState, useEffect } from 'react'
import personsAPI from './services/persons'
import Entries from './components/Entries'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Message from './components/Message'
import ErrorMessage from './components/ErrorMessage'

const App = () => {
  const [persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')
  const [ msgError, setMsgError ] = useState(null)
  const [ msg, setMsg ] = useState(null)

  useEffect(() => {
    personsAPI.getAll()
      .then((newPersons) => {
        setPersons(newPersons)
      })
  }, [])

  const displayMessage = message => {
    setMsg(message)
    setTimeout(() => {setMsg(null)}, 5000)
  }

  const displayErrorMessage = message => {
    setMsgError(message)
    setTimeout(() => {setMsgError(null)}, 5000)
  }

  const handleSubmitPerson = (e) => {
    e.preventDefault()
    if(persons.some(person => person.name === newName)) {
      if(window.confirm(`${newName} is already added to the phonebook, replace their old number with a new one?`)) {
        const newPerson = {
          ...persons.find(person => person.name === newName),
          number: newNumber
        }
        personsAPI.updatePerson(newPerson)
          .then(newRemotePerson => {
            setPersons(persons.map(p => p.name !== newRemotePerson.name ? p : newRemotePerson))
            displayMessage(`Number of ${newRemotePerson.name} was updated`)
          })
          .catch(() => {
            setPersons(persons.filter(p => p.id !== newPerson.id))
            displayErrorMessage(`Could not edit ${newPerson.name} as they are no longer in the database.`)
          })
        setNewName('')
        setNewNumber('')
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber
      }
      personsAPI.addPerson(newPerson)
        .then(newRemotePerson => {
          setPersons(persons.concat(newRemotePerson))
          displayMessage(`Added ${newRemotePerson.name}`)
        })
      setNewName('')
      setNewNumber('')
    }
  }

  const handleDelete = person => {
    if(window.confirm(`Delete ${person.name}?`)) {
      personsAPI.deletePerson(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id))
          displayMessage(`Deleted ${person.name}`)
        })
        .catch(() => {
          setPersons(persons.filter(p => p.id !== person.id))
          displayErrorMessage(`${person.name} already was deleted`)
        })
    }
  }

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Message message={msg}/>
      <ErrorMessage message={msgError}/>
      <Filter filter={filter} setFilter={setFilter} />
      <h2>add a new</h2>
      <PersonForm handleSubmitPerson={handleSubmitPerson} 
        newName={newName} 
        newNumber={newNumber} 
        setNewName={setNewName} 
        setNewNumber={setNewNumber} />
      <h2>Numbers</h2>
      <Entries persons={filteredPersons} handleDelete={handleDelete} />
    </div>
  )
}

export default App