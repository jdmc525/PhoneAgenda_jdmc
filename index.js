

const express = require('express')
const app = express()
app.use(express.json())

app.use(express.static('dist'))

const morgan = require('morgan')
app.use(morgan(''))

morgan.token('type', function (req, res) { return req.headers['content-type'] })
//pendiente el 3.8*
const cors = require('cors')
app.use(cors())



persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "phone": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "phone": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "phone": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "phone": "39-23-6423122"
    },
    {
      "id": 5,
      "name": "John D", 
      "phone": "11111111111111111"
    }
]


/* SOLICITUDES GET */ 

app.get('/api/persons', (request, response)=>{   
    response.json(persons)
})


app.get('/api/info', (request, response)=>{
    const peopleQty = persons.length
    const currentTime = new Date()
    const message = `<h1>Information</h1> 
                    <p>Phonebook has info for ${peopleQty} people</p> 
                    <p>${currentTime}</p>` 
    
    response.send(message)
    
})


app.get('/api/persons/:id', (request, response)=>{
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    person ? response.json(person) : response.status(404).end()

})


/**SOLICITUDES POST */

const generateID = ()=>{
  const maxID = 1000000
  const newID = Math.floor( Math.random() * ( maxID - 1 ) + 1)
  const validateID = persons.some(person => person.id === newID)
  
  //Al llegar al maximo de id ya deja de asignarlas para evitar entrar en un loop infinito
  if (persons.length === maxID-1 ) {
    return    
  } 

  //Entra en un loop en donde va a estar llamandose a si misma hasta asignar un id que no este repetido
  if (validateID) {
    return generateID()
  }else{
    return newID
  }
}


app.post('/api/persons', (request, response)=>{
    
  //Manejo de Errores 
  const body = request.body
    if (!body.name || !body.phone) {
        return response.status(400).json({
            error: "name and phone must be filled"
        })
    } 

    const repeatedName = persons.some( person => person.name.toLowerCase() === body.name.toLowerCase())
    if (repeatedName) {
      return response.status(400).json({
        error: "name must be unique"
    })
    }

    //Crea el objeto persona para agregarlo luego
    const person ={
        id: generateID() ,
        name: body.name,
        phone: body.phone
    }

    persons = persons.concat(person)
    response.json(person)
    
})


/**SOLICITUD DELETE */

app.delete('/api/persons/:id', (request, response)=>{
  
  const id = Number(request.params.id)  
  const deletedPerson = persons.filter( person => person.id === id )
  
  if (!deletedPerson[0]) {
    return response.status(400).json({
      error: "contact don't exist"
  })
  }

  persons = persons.filter( person => person.id !== id )  

  response.json(deletedPerson[0])
  
  
})


const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})







