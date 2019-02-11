const jwt = require('jsonwebtoken')

//middleware that checking authorization for requests
module.exports = (req, res, next ) => {
  //get Authorization header
  const authHeader = req.get("Authorization")

  //no header found
  if(!authHeader) {
    req.isAuth = false
    return next()
  }
  
  //no token found
  const token = authHeader.split(" ")[1] //Bearer asdfadsa
  if(!token || token === "") {
    req.isAuth = false
    return next()
  }

  //decode token
  let decodedToken
  try {
    decodedToken = jwt.verify(token, "somethingneedtobesecurehere")
  } catch (err) {
    req.isAuth = false
    return next()
  }
  if(!decodedToken) {
    req.isAuth = false
    return next()
  }
  req.isAuth = true
  req.userId = decodedToken.userId
  next()
}