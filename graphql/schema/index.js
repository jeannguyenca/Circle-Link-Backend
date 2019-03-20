// buildSchema is used to help us translate writen Schema to Schema object
const { buildSchema } = require("graphql")

module.exports = buildSchema(`
  type CollabStore {
    _id: ID!
    store: Store!
    collab: Store!
    coupons: [Coupon!]
    createdAt: String!
  }

  type RedeemedCoupon {
    _id: ID!
    type: Coupon!
    user: User!
    createdAt: String!
  }

  type Coupon {
    _id: ID!
    name: String!
    description: String
    type: String
    details: String!
    condition: Int!
    status: String
    startDay: String!
    expiredDay: String
    amount: Int
    store: Store!
    collab: Store!
    createdAt: String!
    updatedAt: String!
  }

  type Store {
    _id: ID!
    storename: String!
    address: String!
    creator: User!
    collabs: [CollabStore!]
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
    avatarURL: String
    redeemed: [RedeemedCoupon!]
    createdStores: [Store!]!
    createdAt: String!
    updatedAt: String!
  }

  type AuthData {
    userId: ID!
    role: String!
    token: String!
    tokenExpiration: Int!
  }

  input CouponInput {
    name: String!
    description: String
    type: String
    details: String!
    condition: Int!
    status: String
    startDay: String!
    expiredDay: String
    amount: Int
  }

  input CouponEditInput {
    name: String
    description: String
    type: String
    details: String
    condition: Int
    status: String
    startDay: String!
    expiredDay: String
    amount: Int
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
    avatarURL: String
  }

  type RootQuery {
    stores(option: String): [Store!]!
    coupons(couponId: ID, storeId: ID, option: String): [Coupon!]!
    login(email: String!, password: String!): AuthData!
  }

  type Token {
    token: String!
  }
  
  type RootMutation {
    createStore(storeInput: StoreInput): Store
    createUser(userInput: UserInput, role: String): User
    createCoupon(couponInput: CouponInput, storeId: ID!, collabId: ID): Coupon!
    cancelCoupon(couponId: ID!): Coupon!
    deleteCoupon(couponId: ID!): Store!
    editCoupon(couponEditInput: CouponEditInput, couponId: ID!): Coupon!
    signinUser(email: String!, password: String!): Token
    deleteUser(userId: ID!): User
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`)
