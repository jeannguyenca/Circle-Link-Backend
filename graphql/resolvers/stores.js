const Store = require("../../models/store")
const { transformStore } = require("./merge")

const { dateToString } = require("../../helpers/date")


module.exports = {
  stores: async () => {
    try {
      const stores = await Store.find()
      return stores.map(store => {
        return transformStore(store)
      })
    } catch (err) {
      throw err
    }
  },
  createStore: async (args, req) => {
    //check request authorization 
    if(!req.isAuth) {
      throw new Error("Unauthenticated!")
    }

    //must have storeInput since we nested our input to an object
    const store = new Store({
      storename: args.storeInput.storename,
      address: args.storeInput.address,
      createDate: dateToString(),
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
      creator.stores.push(store)
      await creator.save()
      return createdStore
    } catch (err) {
      console.log(err)
      throw err
    }
  },
}
