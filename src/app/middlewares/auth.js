const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth')
const { promisify } = require('util')

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' })
  }

  const [, token] = authHeader.split(' ')

  try {
    // Verificando se o token é valido
    // O promisify converte a função jwt.verify de callback para promisse
    const decoded = await promisify(jwt.verify)(token, authConfig.secret)

    req.userId = decoded.id

    return next()
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' })
  }
}
