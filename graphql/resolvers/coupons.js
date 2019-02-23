const Coupon = require("../../models/coupon")
const Store = require("../../models/store")
const CollabStore = require("../../models/collabStores")

const { transformCoupon, transformStore, couponsById } = require("./merge")

const { dateToString } = require("../../helpers/date")

module.exports = {
  coupons: async (args, req) => {
    // find all coupons
    if (!args.storeId) {
      try {
        const coupons = await Coupon.find()
        return coupons.map(coupon => {
          return transformCoupon(coupon)
        })
      } catch (err) {
        throw err
      }
    }
    // find coupons with storeID
    if (!args.option) {
      try {
        const store = await Store.findById(args.storeId)

        if (!store) {
          throw new Error("Cannot find store")
        } else {
          console.log(store)
        }

        const coupons = await Coupon.find({ _id: { $in: store.coupons } })

        return coupons.map(coupon => {
          return transformCoupon(coupon)
        })
        
      } catch (err) {
        throw err
      }
    } else if (args.option === "collab") {
      try {
        const collabs = await CollabStore.find({ store: args.storeId})

        if(collabs == null) {
          throw new Error("Cannot find any collab")
        } 

        // get coupons from array of collabs
        let coupons = []

        for(var i = 0; i < collabs.length; i++) {
          coupons.push(await Coupon.find({ _id: { $in: collabs[i].coupons } }))
        }

        if (coupons == null) {
          throw new Error("Cannot find coupon")
        }
        
        //get result from 2D array of coupons
        let result = []

        for (var i = 0;i < coupons.length; i++) {
          for(var j = 0; j < coupons[i].length; j++) {
            result.push(coupons[i][j])
          }
        }
        return result

      } catch (err) {
        throw err
      }
    }
  },
  createCoupon: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!")
    }
    if (req.role !== "store") {
      throw new Error("You are not a store owner!")
    }

    try {
      const fetchStore = await Store.findById(args.storeId)

      const collabStore = await Store.findById(args.collabId)

      const {
        name,
        description,
        type,
        details,
        condition,
        startDay,
        expiredDay,
        amount
      } = args.couponInput

      const coupon = new Coupon({
        name,
        description,
        type,
        details,
        condition,
        status: collabStore ? "pending" : "approved",
        startDay,
        expiredDay,
        amount,
        store: fetchStore,
        collab: collabStore
      })

      const result = await coupon.save()

      //if creating collab coupon
      if (collabStore) {
        const collab = new CollabStores({
          store: fetchStore,
          collab: collabStore,
          coupons: transformCoupon(result)
        })
        await collab.save()

        fetchStore.collabs.push(collab)
        await fetchStore.save()

        collabStore.collabs.push(collab)
        await collabStore.save()
      } else {
        fetchStore.coupons.push(coupon)
        await fetchStore.save()
      }

      return transformCoupon(result)
    } catch (err) {
      throw err
    }
  },
  cancelCoupon: async args => {
    //TODO: Authentication
    try {
      const coupon = await Coupon.findById(args.couponId).populate("store")

      if (!coupon) {
        throw new Error("Cannot find coupon")
      }

      if (coupon.status == Coupon.schema.path("status").enumValues[1]) {
        throw new Error("Coupon is not approved yet")
      }

      if (coupon.status == Coupon.schema.path("status").enumValues[2]) {
        throw new Error("Coupon is already canceled")
      }

      coupon.status = Coupon.schema.path("status").enumValues[2]

      coupon.save()

      return coupon
    } catch (err) {
      throw err
    }
  },
  deleteCoupon: async args => {
    //TODO: Authentication
    try {
      const coupon = await Coupon.findById(args.couponId).populate("store")

      if (!coupon) {
        throw new Error("Cannot find coupon")
      }

      const store = transformStore(coupon.store)
      const storeObj = await Store.findById(store._id)

      await Coupon.deleteOne({ _id: args.couponId })

      storeObj.coupons.pull(args.couponId).remove(coupon)

      await storeObj.save()

      return store
    } catch (err) {
      throw err
    }
  }
}
