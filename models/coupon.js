const mongoose = require("mongoose")

const Schema = mongoose.Schema

const DataSchemaCoupon = new Schema ({
  stores: [
    {
      type: Schema.Types.ObjectId,
      ref: "Store"
    }
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true })

module.exports = mongoose.model("Coupon", DataSchemaCoupon)