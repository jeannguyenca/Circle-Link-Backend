const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')

const User = require("../../models/user")
const { dateToString } = require("../../helpers/date")

module.exports = {
  createUser: async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email })
      if (existingUser) {
        throw new Error("Email exists already.")
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12)

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
        address: args.userInput.address,
      })
      const result = await user.save()
      return { ...result._doc }
    } catch (err) {
      throw err
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email })
    if(!user) {
      throw new Error("User does not exist")
    }
    const isEqual = await bcrypt.compare(password, user.password)
    if(!isEqual) {
      throw new Error("Invalid credential")
    }
    const token = await jwt.sign({ 
      userId: user._id, 
      role: user.role, 
      email: user.email 
    }, 
    "somethingneedtobesecurehere", {
      expiresIn: "1h"
    });
    return { 
      userId: user._id, 
      role: user.role, 
      token: token, 
      tokenExpiration: 1 
    }
  }
}
