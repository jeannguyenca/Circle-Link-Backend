const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const FormData = require("form-data")
const fetch = require("node-fetch")

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
        name: args.userInput.name,
        address: args.userInput.address,
        role: args.role
      })
      const result = await user.save()
      return result
    } catch (err) {
      throw err
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email })
    if (!user) {
      throw new Error("User does not exist")
    }
    const isEqual = await bcrypt.compare(password, user.password)
    if (!isEqual) {
      throw new Error("Invalid credential")
    }
    const token = await jwt.sign(
      {
        userId: user._id,
        role: user.role,
        email: user.email
      },
      process.env.SECRET,
      {
        expiresIn: "1h"
      }
    )
    return {
      userId: user._id,
      role: user.role,
      token: token,
      tokenExpiration: 1
    }
  },
  googleUser: async ({ code, url }) => {
    try {
      const formData = new FormData()
      formData.append("code", code)
      formData.append(
        "client_id",
        "812921217937-d0gldtfcfa3r5c6c9rbqdc8tcnv7bt09.apps.googleusercontent.com"
      )
      formData.append("client_secret", process.env.GOOGLE_SECRET)
      formData.append("grant_type", "authorization_code")
      formData.append("redirect_uri", url)

      console.log(url)

      const fetchToken = await fetch(
        `https://www.googleapis.com/oauth2/v4/token`,
        {
          headers: formData.getHeaders(),
          method: "POST",
          body: formData
        }
      )

      const accessToken = await fetchToken.json()
      console.log(accessToken)

      const fetchUserInfo = await fetch(
        `https://www.googleapis.com/userinfo/v2/me`,
        {
          headers: {
            Authorization: `Bearer ${accessToken.access_token}`
          }
        }
      )

      const userInfo = await fetchUserInfo.json()

      // console.log(userInfo)

      const existingUser = await User.findOne({ email: userInfo.email })

      if (!existingUser) {
        const user = new User({
          email: userInfo.email,
          name: userInfo.name,
          avatarURL: userInfo.picture,
          googleAccount: [
            {
              id: userInfo.id,
              access_token: accessToken.access_token,
              id_token: accessToken.id_token,
              expires_in: accessToken.expires_in,
              refresh_token: accessToken.refresh_token
            }
          ]
        })

        const result = await user.save()

        if (result) {
          const token = await jwt.sign(
            {
              userId: user._id,
              role: user.role,
              email: user.email
            },
            process.env.SECRET,
            {
              expiresIn: "1h"
            }
          )
          return {
            userId: user._id,
            role: user.role,
            token: token,
            tokenExpiration: 1
          }
        }
      } else {
        if (existingUser.googleAccount._id === null) {
          throw new Error("Email exists already.")
        }
        const token = await jwt.sign(
          {
            userId: existingUser._id,
            role: existingUser.role,
            email: existingUser.email
          },
          process.env.SECRET,
          {
            expiresIn: "1h"
          }
        )
        return {
          userId: existingUser._id,
          role: existingUser.role,
          token: token,
          tokenExpiration: 1
        }
      }
    } catch (err) {
      throw err
    }
  },
  user: async (args, req) => {
    if (req.isAuth) {
      try {
        const user = await User.findById(req.userId)
        if (!user) {
          throw new Error("Cannot find any user.")
        }
        return user
      } catch (err) {
        console.log(err)
      }
    }
  }
}
