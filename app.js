const express = require("express")
const bodyParser = require("body-parser")
const graphqlHttp = require("express-graphql")
const mongoose = require("mongoose")

const graphQLSchema = require("./graphql/schema/index")
const graphQLResolevers = require("./graphql/resolvers/index")

const isAuth = require("./middleware/is-auth")

const app = express()

//run middleware on every coming request
app.use(bodyParser.json())
app.use(isAuth)

//graphql endpoint
app.use(
  "/graphql",
  graphqlHttp({
    schema: graphQLSchema,
    rootValue: graphQLResolevers,
    graphiql: true
  })
)

//mongoDB database connection 
mongoose
  .connect(process.env.URI, { useNewUrlParser: true })
  .then(() => {
    app.listen(4000)
  })
  .catch(err => {
    console.log(err)
  })
