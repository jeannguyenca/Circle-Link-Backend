const Store = require("../../models/store")
const User = require("../../models/user")

const { transformStore } = require("./merge")

const { stores } = require("./merge")

const { dateToString } = require("../../helpers/date")


module.exports = {
  stores: async (args, req) => {
    // if (!req.isAuth) {
    //   throw new Error("Unauthenticated!")
    // }

    if(req.role === "store") {
      if (args.option === "mystore") {
        try {
          const user = await User.findById(req.userId)
          const storeId = user.createdStores
          return getStores = stores(storeId)

        } catch (err) {
          throw err
        }
      }

    }
    
      const storeIds = await Store.find()
      return stores(storeIds)

  },
  createStore: async (args, req) => {
    //check request authorization 
    if(!req.isAuth) {
      throw new Error("Unauthenticated!")
    }

    if (req.role !== "store") {
      throw new Error("You are not a store owner!")
    }

    //must have storeInput since we nested our input to an object
    const store = new Store({
      storename: args.storeInput.storename,
      address: args.storeInput.address,
      creator: req.userId
    })
    let createdStore

    try {
      const result = await store.save()
      createdStore = transformStore(result)
      const creator = await User.findById(req.userId)

      if (!creator) {
        throw new Error("User not found")
      }
      creator.createdStores.push(store)

      await creator.save()
      return createdStore
    } catch (err) {
      console.log(err)
      throw err
    }
  },
}
