const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const userRoutes = require('../routes/userRoute.js')
const appRoutes = require('../routes/appRoute.js')
const cors = require('cors')

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(cors({ origin: 'http://localhost:3000',credentials: true, methods:["GET", "POST", "PUT", "PATCH", "DELETE"] }));

mongoose.connect('mongodb+srv://test:test@test.uhsus.mongodb.net/?retryWrites=true&w=majority&appName=Test').then(()=>{
    console.log('Mongodb connected')
})
app.get('/', (req,res)=>{
    res.json('Hello')
})
app.use('/users', userRoutes)
app.use('/apps', appRoutes)


app.listen(5000)