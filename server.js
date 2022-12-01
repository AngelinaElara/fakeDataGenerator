const http = require('http')
const express = require('express')
const {Server} = require('socket.io')
const real_time_app = require('./realTimeApp')
const path = require('path')

const PORT = 5003
const HOST = 'localhost'
const STATIC_FOLDER = path.resolve(__dirname, 'static')

const app = express()
const http_server = http.createServer(app)
const io = new Server(http_server)

app.use(express.static(STATIC_FOLDER))

app.get('/', (req, res) => {
    res.sendFile(path.resolve(STATIC_FOLDER, 'index.html'))
})

io.on('connection', real_time_app)

http_server.listen(PORT, HOST, ()=>{
    console.log(`HTTP server is working on ${HOST}:${PORT}!`)
})