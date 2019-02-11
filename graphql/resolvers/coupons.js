const Coupon = require("../../models/coupon")
const Store = require("../../models/store")

const { transformCoupon, transformStore } = require("./merge")

const { dateToString } = require("../../helpers/date")



module.exports = {
  coupons: async () => {
    try {
      const coupons = await Coupon.find()
      return coupons.map(coupon => {
        return transformCoupon(coupon)
      })
    } catch (err) {
      throw err
    }
  },
  createCoupon: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!")
    }
    try {
      const fetchStores = await Store.find({
        '_id': { $in: args.storeIds }
      })
      const coupon = new Coupon({
        user: req.userId,
        stores: fetchStores
      })
      const result = await coupon.save()
      return transformCoupon(result)
    } catch (err) {
      throw err
    }
  },
  cancelCoupon: async args => {
    try {
      const coupon = await Coupon.findById(args.couponId).populate('stores')
      const stores = coupon.stores.map(fetchStore => {
        return transformStore(fetchStore)
      })
      await Coupon.deleteOne({ _id: args.couponId })
      return stores
    } catch (err) {
      throw err
    }
  }
}
