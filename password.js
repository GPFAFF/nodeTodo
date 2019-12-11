const { password } = require('./config');

const passwordProtected = (req, res, next) => {
  res.set('WWW-Authenticate', 'Basic realm="Simple Todo App"');
  if (req.headers.authorization === password) {
    next();
  } else {
    res.status(401).send('Authentication required')
  }
}

module.exports = {
  passwordProtected,
}