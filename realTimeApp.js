const FakeDataGenerator = require('./domain/FakeDataGenerator')
const fakeGenerators = {}


module.exports = function(socket) {
  try{
    socket.on('lazy_load', () => {
      try{
        const generator = fakeGenerators[socket.id]
        if(!generator) throw new Error('Generator does not exist!')
        const records = generator.genRecords(10)
        socket.emit('$lazy_load', records)
      }
      catch(err){
        socket.emit('$err', 'Something went wrong!')
        console.log(err)
      }
    })

    socket.on('generate_records', (options={}) => {
      try {
        const {seed, error_coef, region} = options
        const generator = new FakeDataGenerator({seed, error_coef, region})
        fakeGenerators[socket.id] = generator
        const records = generator.genRecords(20)
        socket.emit('$generate_records', records)
      }
      catch(err){
        socket.emit('$err', 'Something went wrong!')
        console.log(err)
      }
    })

    socket.on('disconnect', () => delete fakeGenerators[socket.id])
  }
  catch(err){
    socket.emit('$err', 'Something went wrong!')
    console.log(err)
  }
}