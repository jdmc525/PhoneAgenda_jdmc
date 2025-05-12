

const express = require('express')

const app = express()
app.use(express.json())
app.use(express.static('dist'))

const morgan = require('morgan')
app.use(morgan('tiny'))
//pendiente el 3.8*


// const cors = require('cors')
// app.use(cors())

require('dotenv').config();

const Contact = require('./models/contact')


/* SOLICITUDES GET */ 

app.get('/api/persons', (request, response)=>{   
    
  Contact.find({}).then( contacts => response.json(contacts) )
  
})


app.get('/api/info', (request, response)=>{

  Contact.countDocuments().then(peopleQty => {
    const currentTime = new Date()
    const message = `<h1>API Information</h1> 
                    <p>Phonebook has info for ${peopleQty} people</p> 
                    <p>${currentTime}</p>` 
    
    response.status(200).send(message)
  } )
    
})


app.get('/api/persons/:id', (request, response, next)=>{
  Contact.findById(request.params.id).then( person => { 
    if (!person) {
      return response.status(400).json({
          error: "contact doesn't exist"
      }) 
    }
    response.status(200).json(person) 

  }).catch(error => next(error))
})


/**SOLICITUDES POST */
app.post('/api/persons', (request, response, next)=>{
    const body = request.body
  
  //Crea el objeto persona para agregarlo luego
    const person = new Contact({
        name: body.name,
        phone: body.phone
    })

    person.save()
      .then( savedPerson => response.json(savedPerson)  )
      .catch(error => next(error))
    
})

/*SOLICITUD PUT */

app.put('/api/persons/:id', (request, response, next)=>{
  const body = request.body;

  const person = {
    name: body.name,
    phone: body.phone 
  } 

  Contact.findByIdAndUpdate(request.params.id, person, { new: true , runValidators: true , context:'query' })
    .then( updatedPerson => {
      response.status(200).json(updatedPerson)
    }).catch(error => next(error))

})


/**SOLICITUD DELETE */

app.delete('/api/persons/:id', (request, response, next)=>{
  
  Contact.findByIdAndDelete(request.params.id).then( deletedPerson => {
    if (!deletedPerson) {
      return response.status(400).json({
        message: "contact doesn't exist"
      })
    }  

    response.status(200).json(deletedPerson)
  }).catch(error => next(error))

})


/* MANEJO DE ERRORES */
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send(error.message)
  }
  next(error)
}
// este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!
app.use(errorHandler)




/*PUERTOS */

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})







