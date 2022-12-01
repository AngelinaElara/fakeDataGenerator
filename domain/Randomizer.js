const seedrandom = require('seedrandom')
const {isNumeric} = require('../lib/isNumeric')

class Randomizer{

  constructor(options={}){
    const {seed} = options
    if(!seed) throw new Error('Wrong params!')
    this._random = seedrandom(seed)
  }

  // select random element from array
  randomSelect(arr){
    if(!arr) throw new Error('Wrong params!')
    const index = Math.floor(this._random() * arr.length)
    return arr[index]
  }

  rangeNumber(start, end){
    return Math.floor((this._random() * (end - start + 1) + start))
  }

  isPossibilityEventOccured(pos){
    if(!isNumeric(pos) || pos < 0 || pos > 1) throw new Error('Wrong params!')
    return this._random() <= pos;
  }
}

module.exports = Randomizer