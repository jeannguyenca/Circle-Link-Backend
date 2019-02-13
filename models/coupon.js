const mongoose = require("mongoose")

const Schema = mongoose.Schema

const DataSchemaCoupon = new Schema ({
  type: {
    type: String,
    required: true
  },
  decription: {
    type: String,
    required: true
  },
  percentOff: Number,
  free: String,
  startDay: {
    type: Date,
    required: true
  },
  expiredDay: {
    type: Date,
    required: true
  },
  amount: Number,
  stores: [
    {
      type: Schema.Types.ObjectId,
      ref: "Store"
    }
  ]
}, { timestamps: true })

module.exports = mongoose.model("Coupon", DataSchemaCoupon)