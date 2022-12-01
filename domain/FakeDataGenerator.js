const Randomizer = require('./Randomizer')
const Faker = require('faker/lib/index')
const { isNumeric } = require('../lib/isNumeric')

class FakeDataGenerator{
  constructor(options={}){
    let {seed, error_coef, region} = options
    seed = parseFloat(seed)
    if(!region) throw new Error('Wrong region!')
    if(!isNumeric(seed)) throw new Error('Wrong seed!')
    if(!isNumeric(error_coef) || error_coef < 0 || error_coef > 10) throw new Error('Wrong error coef!')
    this.randomizer = new Randomizer({seed})
    this.faker = this.createFaker(seed, region)
    this.mistakes = [
      this.addRandomMistake.bind(this),
      this.exchangeRandomSymbolMistake.bind(this),
      this.dropRandomSymbolMistake.bind(this)
    ]
    this.error_coef = error_coef
    this.COUNT_PER_PAGE = 20
  }

  createFaker(seed, region) {
    const faker = new Faker({ locales: require('faker/lib/locales') })
    faker.seed(seed)
    return faker
  }


  genRecords(count_per_page = this.COUNT_PER_PAGE){
    const records = []
    for(let i = 0; i < count_per_page; i++){
      const record = this.createRecord()
      if(this.error_coef === 0) { 
        records.push(record)
        continue
      }
      const random_field = this.randomizer.randomSelect(Object.keys(record))
      let error_coef = this.error_coef
      while(error_coef !== 0){
        if(error_coef < 1){
          const is_event_occured = this.randomizer.isPossibilityEventOccured(error_coef)
          if(is_event_occured) record[random_field] = this.doMistake(record[random_field].toString())
          error_coef = 0
        }
        else {
          record[random_field] = this.doMistake(record[random_field].toString())
          error_coef--
        }
      }
      records.push(record)
    }
    return records
  }

  createRecord(){
    return {
      id: this.faker.datatype.uuid(),
      n: this.faker.datatype.number(),
      full_name: this.faker.name.findName(),
      country: this.faker.address.country(),
      city: this.faker.address.city(),
      address: this.faker.address.streetAddress(),
      phone: this.faker.phone.phoneNumberFormat()
    }
  }

  doMistake(str){
    const randomMistake = this.randomizer.randomSelect(this.mistakes)
    return randomMistake(str)
  }


  addRandomMistake(str){
    const symbols = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890~!#$%^&*()_+{}:|?><>|[]=-.,'
    const addSymbol = this.randomizer.randomSelect(symbols)
    if(!str.length) return addSymbol
    const randomPosition = this.randomizer.rangeNumber(0, str.length)
    return str.slice(0, randomPosition) + addSymbol + str.slice(randomPosition)
  }

  exchangeRandomSymbolMistake(str){
    if(!str.length) return ''
    let a_position, b_position
    while(a_position === b_position){
      a_position = this.randomizer.rangeNumber(0, str.length)
      b_position = this.randomizer.rangeNumber(0, str.length)
    }

    if(a_position === b_position) return str

    let resultStr = ''
    for(let i = 0; i < str.length; i++){
      if(i === a_position){
        resultStr += str[b_position]
        continue
      }

    if(i === b_position){
      resultStr += str[a_position]
      continue;
    }

    resultStr += str[i]
    }

    return resultStr
  }

  dropRandomSymbolMistake(str){
    if(!str.length) return ''
    const randomPosition = this.randomizer.rangeNumber(0, str.length)
    return str.split('').filter((el, index) => index !== randomPosition).join('')
  }

  reset(seed){
    if(!seed) throw new Error('Wrong params!')
    this.randomizer = new Randomizer({seed})
    this.seed = this.createFaker(seed)
  }
}

module.exports = FakeDataGenerator