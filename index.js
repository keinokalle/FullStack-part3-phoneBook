require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (request, response) => {
  response.send('<h1>Phonebook </h1>')
})

app.get('/api/persons', (request, response) => {
  console.log('\nihan perussettii\n')

  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  const requestTime = new Date()
  Person.countDocuments({}).then(count => {
    response.send(
      `<p>Phonebook has info for ${count} people</p>
      <p>${requestTime.toString()}</p>`
    )
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if(person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  console.log('\nmiks tää ei ilmesty\n')

  console.log(name)
  console.log(number)

  Person.findById(request.params.id)
    .then((person) => {
      if(!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  console.log(body)

  const person = new Person({
    name: body.name,
    number: body.number || 'no number',
  })

  person.
    save().then((savedPerson) => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

//Handling of unknown endpoints
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

//Finally handling of actual errors
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})