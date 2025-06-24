const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]

const url = `mongodb+srv://phoneBookKalle:${password}@phonebook.gb2m3mp.mongodb.net/personData?retryWrites=true&w=majority&appName=phoneBook`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if(newName!==undefined && newNumber!==undefined) {
  const person = new Person({
    name: newName,
    number: newNumber,
  })

  person.save().then(() => {
    console.log('note saved!')
    mongoose.connection.close()
  })

} else {
  Person.find({}).then(result => {
    result.forEach(p => {
      console.log(p)
    })
    mongoose.connection.close()
  })
}

