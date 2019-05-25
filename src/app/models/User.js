const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
})

// Antes de salvar os dados em banco criptografa a senha
UserSchema.pre('save', async function (next) {
  if (!this.isDirectModified('password')) {
    return next()
  }

  this.password = await bcrypt.hash(this.password, 8)
})

// Metodos que cada instância do user vai ter
UserSchema.methods = {
  compareHash (password) {
    return bcrypt.compare(password, this.password)
  }
}
// Será disparado diretamente do model de usuários
UserSchema.statics = {
  generateToken ({ id }) {
    return jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.ttl
    })
  }
}

module.exports = mongoose.model('User', UserSchema)
