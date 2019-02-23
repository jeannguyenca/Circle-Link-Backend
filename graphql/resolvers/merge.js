const Store = require("../../models/store")
const User = require("../../models/user")
const { dateToString } = require("../../helpers/date")

const transformStore = store => {
  return {
    ...store._doc,
    createDate: dateToString(store._doc.createDate),
    creator: user.bind(this, store.creator)
  }
}

const transformCoupon = coupon => {
  return {
    ...coupon._doc,
    createdAt: dateToString(coupon._doc.createdAt),
    updatedAt: dateToString(coupon._doc.updatedAt),
    store: singleStore.bind(this, coupon._doc.store),
    collab: user.bind(this, coupon._doc.collab)
  }
}

const couponsById = async couponIDs => {
  try {
    const coupons = await Coupon.find({ _id: { $in: couponIDs } })
    return coupons.map(coupon => {
      return transformCoupon(coupon)
    })
  } catch (err) {
    throw err
  }
}

const stores = async storeIds => {
  try {
    const stores = await Store.find({ _id: { $in: storeIds } })
    return stores.map(store => {
      return transformStore(store)
    })
  } catch (err) {
    throw err
  }
}

const singleStore = async storeId => {
  try {
    const store = await Store.findById(storeId)
    return {
      ...store._doc,
      user: user.bind(this, store.creator),
    }
  } catch (err) {
    throw err
  }
}

const user = async userId => {
  try {
    const user = await User.findById(userId)
    return {
      ...user._doc,
      stores: stores.bind(this, user.stores)
    }
  } catch (err) {
    throw err
  }
}

exports.stores = stores
exports.couponsById = couponsById
exports.singleStore = singleStore
exports.user = user
exports.transformStore = transformStore
exports.transformCoupon = transformCoupon

