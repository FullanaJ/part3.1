const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())

morgan.token('object', (req, res) => {
    return JSON.stringify(req.body)
})



let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    { 
      "id": 5,
      "name": "Jorge", 
      "number": "39-23-6423122"
    }
]

app.get('/api/info' , (request,response) => {
  response.send(`<p>phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)
  if (person) { response.json(person) }
  else { response.status(404).end() }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

const generateId = () => {
  return Math.floor(Math.random() * 1000000)
}

app.post('/api/persons', morgan(':method :url :status :res[content-length] - :response-time ms :object'), (request, response) => {
  const body = request.body

    console.log(body)

  if (!body.number || !body.name) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }
  if (persons.find(p => p.name === body.name))
    return response.status(409).json({
      error:'the name already exist on server'
  })
  const person = {
    name: body.name,
    number:body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})