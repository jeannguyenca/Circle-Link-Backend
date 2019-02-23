/*TODO:
  - Collab stores function/collab status/manage collab
  - Coupon used bases on store
  - Coupon count base on date? (optional)
  - Find near by stores?
  - Login with Gmail/Facebook
*/ 

const express = require("express")
const bodyParser = require("body-parser")
const graphqlHttp = require("express-graphql")
const mongoose = require("mongoose")

const graphQLSchema = require("./graphql/schema/index")
const graphQLResolevers = require("./graphql/resolvers/index")


const isAuth = require("./middleware/is-auth")

const app = express()


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
})


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

// For find and update in resolver -- coupons
mongoose.set('useFindAndModify', false)

//mongoDB database connection 
mongoose
  .connect(process.env.URI, { useNewUrlParser: true })
  .then(() => {
    app.listen(4000)
  })
  .catch(err => {
    console.log(err)
  })
