const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(express.json())

app.use(cors())

app.use(express.static('build'))

morgan.token('data', function (req, res) {return JSON.stringify(req.body)})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello there!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/info', (request, response) => {
    const infoCount = persons.length
    const date = new Date()

    response.send(
        `Phonebook has info for ${infoCount} people
        <br />
        ${date}`
        )
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    const generateId = Math.round(Math.random()*100)
    const names = persons.map(person => person.name).toString().toLowerCase()

    if(!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }
    if(!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if(names.includes(body.name.toLowerCase())) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId,
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})