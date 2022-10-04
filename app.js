const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const app = express()

app.use(express.json)
app.use(cors())

const mongoUrl='mongodb+srv://anton:anton@cluster0.fnys6uo.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(mongoUrl,{
  useNewUrlParser:true,
}).then(()=>{console.log('Connected to database')})
.catch(e=>console.log(e))

require('./userDetails')
const JWT_SECRET='justArandomString123'

app.listen(5000, () => {
  console.log('Server started')
})

const User = mongoose.model('UserInfo')

app.post('/register', async(req,res)=>{
  const {firstName,lastName,email,password} = req.body

  const hashPassword = await bcrypt.hash(password, 10)
  try {
    const oldUser = await User.findOne({ email })
    if(oldUser){
      return res.json({ error: 'User already exists'})
    }
    await User.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
    })
    res.send({status:'User created!'})
  } catch (error) {
    res.send({status:'error'})
  }
})

app.post('/login-user', async (req,res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if(!user){
    return res.json({ error: 'User not found' })
  }
  if(await bcrypt.compare(password,user.password)){
    const token = jwt.sign({email:user.email}, JWT_SECRET)

    if(res.status(201)){
      return res.json({ status: 'User registered', data: token })
    } else {
      return res.json({ error: 'error'})
    }
  }
  res.json({ status: 'error', error: 'Invalid Password' })
})

app.post('/user', async (req,res) => {
  const { token } = req.body
  try {
    const user=jwt.verify(token,JWT_SECRET)
    const userEmail = user.email
    User.findOne({ email: userEmail }).then((data) => {
      res.send({ status: 'User exists', data: data })
    }).catch((error) => {
      res.send({ status: 'error', data: error })
    })
  } catch (error) {}
})
