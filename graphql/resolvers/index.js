const userResolver = require("./users")
const storeResolver = require("./stores")
const couponResolver = require("./coupons")

const rootResolver = {
  ...userResolver,
  ...storeResolver,
  ...couponResolver
}

module.exports = rootResolver