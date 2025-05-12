
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

//Trae la URL por variable de entorno
require('dotenv').config()
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, "Error: El nombre debe tener al menos 3 caracteres"],
    required :[true, `Error: El nombre es obligatorio` ],
  },
  phone: {
    type: String,
    minLength: [8,"Error: El numero de telefono debe tener al menos 8 caracteres"],
    required: [true, `Error: El numero de telefono es obligatorio` ],
    validate: {
        validator: (value)=>{
          if ( value.indexOf('-') === 2 || value.indexOf('-') === 3  ) {
              const valueNumber = Number( value.replace('-', '0'))
              return !isNaN(valueNumber) 
          }else{
              return false
          }
        },
        message: props => `Error: ${props.value} no es valido, debe cumplir el formato XXX-XXXXX o XX-XXXXXX`
    }
  },
})

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Contact', contactSchema)


