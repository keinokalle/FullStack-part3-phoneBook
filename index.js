const express = require('express')
const morgan = require('morgan')
const app = express()

let persons = [
    {
        id: "1",
        name: "Kalle",
        number: "123"
    },
    {
        id: "2",
        name: "Oona",
        number: "456"
    },
    {
        id: "3",
        name: "Ella",
        number: "789"
    },
    {
        id: "4",
        name: "Pekka",
        number: "123456789"
    }
]

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())
app.use(express.static('dist'))

app.get('/', (request, response) => {
  response.send('<h1>Phonebook </h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
    const requestTime = new Date();
    response.send(
        `<p>Phonebook has info for ${persons.length} people</p>
        <p>${requestTime.toString()}</p>`
    );
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.filter(p => p.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body);
    
    if (!body.name) {
        return response.status(400).json({ 
        error: 'no name' 
        })
    } else if(!body.number) {
        return response.status(400).json({ 
        error: 'no number' 
        })
    } else if(persons.some(p => p.name === body.name)){
        return response.status(400).json({ 
        error: 'name must be unique' 
        })
    }

    const person = {
        name: body.name,
        number: body.number || "no number",
        id: generateId(),
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})