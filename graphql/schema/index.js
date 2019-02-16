// buildSchema is used to help us translate writen Schema to Schema object
const { buildSchema } = require("graphql")

module.exports = buildSchema(`
  type RedeemedCoupon {
    _id: ID!
    type: Coupon!
    user: User!
    createdAt: String!
  }

  type Coupon {
    _id: ID!
    type: String!
    description: String
    percentOff: Int
    free: String
    startDay: String!
    expiredDay: String!
    amount: Int
    stores: [Store!]!
    createdAt: String!
    updatedAt: String!
  }

  type Store {
    _id: ID!
    storename: String!
    address: String!
    creator: User!
    collabs: [Store!]
    coupons: [Coupon!]
    createdAt: String!
    updatedAt: String!
  }

  type User {
    _id: ID!
    email: String!
    password: String!
    role: String!
    name: String
    address: String
    points: Int
    redeemed: [RedeemedCoupon!]
    createdStores: [Store!]!
    createdAt: String!
    updatedAt: String!
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
    name: String
    address: String
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