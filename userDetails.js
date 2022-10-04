const mongoose = require('mongoose')

const UserDetails = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
},
{
  collection: 'UserInfo',
})

mongoose.model('UserInfo', UserDetails)
