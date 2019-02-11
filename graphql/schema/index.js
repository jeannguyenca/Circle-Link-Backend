// buildSchema is used to help us translate writen Schema to Schema object
const { buildSchema } = require("graphql")

module.exports = buildSchema(`
  type Coupon {
    _id: ID!
    stores: [Store!]
    user: User!
    createdAt: String!
    updatedAt: String!
  }

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

  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
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
    coupons: [Coupon!]!
    login(email: String!, password: String!): AuthData!
  }

  type RootMutation {
    createStore(storeInput: StoreInput): Store
    createUser(userInput: UserInput): User
    createCoupon(storeIds: [ID!]!): Coupon!
    cancelCoupon(couponId: ID!): [Store!]!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`)