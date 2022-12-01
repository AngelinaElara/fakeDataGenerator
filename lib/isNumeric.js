function isNumeric(n){
    return !isNaN(parseFloat(n)) && isFinite
}

module.exports = {isNumeric}