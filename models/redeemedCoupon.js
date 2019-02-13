const mongoose = require("mongoose")

const Schema = mongoose.Schema

const DataSchemaRedeemedCoupon = new Schema({
  type: {
    type: Schema.Types.ObjectId,
    ref: "Coupon"
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true })

module.exports = mongoose.model("RedeemedCoupon", DataSchemaRedeemedCoupon)