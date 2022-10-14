import { useEffect, useState } from 'react'
import personService from './services/persons'
import './index.css'

const Person = ({person, suggestDelete}) => {
  return (
    <div>
      <p>{person.name} {person.number}</p>
      <button onClick={()=>suggestDelete(person.id, person.name)}>delete</button>
    </div>
  )
}

const Filter = (props) => {
  return (
    <div>
      filter shown with <input value={props.filter} onChange={props.handler}/>
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.happening}>
      <div>
        name: <input value={props.name} onChange={props.nameHandler}/>
      </div>
      <div>
        number: <input value={props.number} onChange={props.numberHandler} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
)
}

const Persons = (props) => {
  return (
    props.persons.map(person =>
      <Person key={person.name} person={person} suggestDelete={props.action}/>
    )
  )
}

const Notification = ({message, type}) => {
  if (message === null) {
    return null
  }

  return (
    <div className={type}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter ] = useState('')
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('confirm')

  useEffect(() => {
  personService.getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
    })
  },[])

  const notificationMessage = (note) => {
    setNotification(note)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personObject ={
      name: newName,
      number: newNumber
    }
    const namesLower = persons.map((person) => person.name.toLowerCase())

    if (namesLower.includes(newName.toLowerCase())) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const contact = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())
        console.log(contact)
        const changedContact = {...contact, number: newNumber}
        const id = contact.id
        
        personService
          .update(id, changedContact)
            .then(returnedContact => {
              setPersons(persons.map(person => person.id !== id ? person : returnedContact ))
              notificationMessage(`${newName} updated`)
            })
            .catch(error => {
              setNotificationType('error')
              notificationMessage(`Information of ${newName} has already been removed from server`)
              setTimeout(() => {
                setNotificationType('confirm')
              }, 5000)
              setPersons(persons.filter(person => person.id !== id))
            })
      }
    }
    else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          notificationMessage(`${newName} added`)
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(setPersons(persons.filter(person => person.id !== id )))
        .then(notificationMessage(`${name} deleted`))
    }
  }

  const personsToShow = (newFilter === '')
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  const handleFilterChanges = (event) => {
    setNewFilter(event.target.value)
  }

  const handleNameChanges = (event) => {
    setNewName(event.target.value)
  }
  
  const handleNumberChanges = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} type={notificationType} />
      <Filter filter={newFilter} handler={handleFilterChanges} />
      <h3>Add a new contact</h3>
      <PersonForm happening={addPerson}
        name={newName} nameHandler={handleNameChanges}
        number={newNumber} numberHandler={handleNumberChanges}
        />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} action={deletePerson}/>
    </div>
  )
}

export default App