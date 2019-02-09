const express = require("express")
const bodyParser = require("body-parser")
const graphqlHttp = require("express-graphql")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const Store = require("./models/store")
const User = require("./models/user")

// buildSchema is used to help us translate writen Schema to Schema object
const { buildSchema } = require("graphql")

const app = express()

app.use(bodyParser.json())

const stores = storeIds => {
  return Store.find({ _id: { $in: storeIds } })
    .then(stores => {
      return stores.map(store => {
        return { 
          ...store._doc, 
          creator: user.bind(this, store.creator)
        }
      })
    }).catch(err => {
      throw err
    })
}

const user = userId => {
  return User.findById(userId)
  .then(user => {
    return { ...user._doc,
      stores: stores.bind(this, user.stores)
    }
  })
  .catch(err => {
    throw err
  })
}

app.use(
  "/graphql",
  graphqlHttp({
    schema: buildSchema(`
      type Store {
        _id: ID!
        username: String!
        storename: String!
        address: String!
        createDate: String!
        creator: User!
      }

      type User {
        _id: ID!
        email: String!
        password: String
        address: String
        dob: String
        stores: [Store!]
      }

      input StoreInput {
        storename: String!
        address: String!
      }

      input UserInput {
        email: String!
        password: String!
        address: String
        dob: String
      }

      type RootQuery {
        stores: [Store!]!
      }

      type RootMutation {
        createStore(storeInput: StoreInput): Store
        createUser(userInput: UserInput): User
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `),
    rootValue: {
      stores: () => {
        return Store.find()
          .then(stores => {
            return stores.map(store => {
              return {
                ...store._doc,
                creator: user.bind(this, store._doc.creator)
              }
            })
          })
          .catch(err => {
            throw err
          })
      },
      createStore: args => {
        //must have storeInput since we nested our input to an object
        const store = new Store({
          storename: args.storeInput.storename,
          address: args.storeInput.address,
          createDate: new Date().toISOString(),
          creator: "5c5263294004c4099e2a2453"
        })
        let createdStore
        return store
          .save()
          .then(result => {
            createdStore = { ...result._doc }
            return User.findById("5c5263294004c4099e2a2453")
          })
          .then(user => {
            if (!user) {
              throw new Error("User not found")
            }
            user.stores.push(store)
            return user.save()
          })
          .then(result => {
            return createdStore
          })
          .catch(err => {
            console.log(err)
            throw err
          })
      },
      createUser: args => {
        return User.findOne({ email: args.userInput.email })
          .then(user => {
            if (user) {
              throw new Error("Email exists already.")
            }
            return bcrypt.hash(args.userInput.password, 12)
          })
          .then(hashedPassword => {
            const user = new User({
              email: args.userInput.email,
              password: hashedPassword,
              address: args.userInput.address,
              dob: new Date().toISOString()
            })
            return user.save()
          })
          .then(result => {
            return { ...result._doc }
          })
          .catch(err => {
            throw err
          })
      }
    },
    graphiql: true
  })
)

mongoose
  .connect(
    process.env.URI,
    { useNewUrlParser: true }
  )
  .then(() => {
    app.listen(4000)
  })
  .catch(err => {
    console.log(err)
  })
