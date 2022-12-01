const socket = io("ws://localhost:5003")

IS_LAZY_LOAD_BLOCKED = false

function isNumeric (n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

function renderRecords (records) {
  let list_html = ''
  for(const record of records){
      list_html +=`<tr>
      <td>${record.n}</td>
      <td>${record.id}</td>
      <td>${record.full_name}</td>
      <td> ${record.country},${record.city},${record.address}</td>
      <td>${record.phone}</td>
      </tr>`
  }
  document.querySelector('.fake_list').innerHTML = list_html
}

function genData (e) {
  try {
    e.preventDefault()
    const seed = parseFloat(document.querySelector('.seed').value) || 1
    let error_coef = document.querySelector('.error_coef').value || 0
    let region = document.querySelector('.region').value

    if(!isNumeric(seed) || seed < 0 || seed > 10000) throw new Error('Seed must be 1 - 10000 range number!')
    if(!isNumeric(error_coef) || error_coef < 0 || error_coef > 1000) throw new Error('Error must be 1 - 1000 range number!')
    
    error_coef = +(error_coef / 100).toFixed(1)
    socket.emit('generate_records', {seed, error_coef, region})
  }
  catch (err) {
    Swal.fire({
      title: 'Error!',
      text: err.message,
      icon: 'error'
    })
    console.log(err)
  }
}

function onFakeListScroll (e) {
  const fake_list = document.querySelector('.scroll')
  if (fake_list.offsetHeight + fake_list.scrollTop >= fake_list.scrollHeight) {
    IS_LAZY_LOAD_BLOCKED = true
    socket.emit('lazy_load')
  }
}

function onLazyLoad (records) {
  const fake_list = document.querySelector('.fake_list')
  for(const record of records){
    fake_list.innerHTML += `<tr>
    <td>${record.n}</td>
    <td>${record.id}</td>
    <td>${record.full_name}</td>
    <td> ${record.country},${record.city},${record.address}</td>
    <td>${record.phone}</td>
    </tr>`
  }
  IS_LAZY_LOAD_BLOCKED = false
}

function main() {
  socket.emit('generate_records', {seed: 1, error_coef: 0, region: 'ru'})
}

main()

// handlers
document.querySelector('.gen_data_btn').addEventListener('click', genData)
document.querySelector('.scroll').addEventListener('scroll', onFakeListScroll)

socket.on('$generate_records', renderRecords)
socket.on('$lazy_load', onLazyLoad)