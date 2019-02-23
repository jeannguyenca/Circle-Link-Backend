const mongoose = require("mongoose")

const Schema = mongoose.Schema

const DataSchemaCoupon = new Schema ({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  type: {
    type: String,
    enum: ["percentOff", "free"],
    default: "percentOff"
  },
  details: {
    type: String,
    required: true,
  },
  condition: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "approved", "canceled"],
    default: "pending"
  },
  startDay: {
    type: Date,
    required: true
  },
  expiredDay: {
    type: Date,
  },
  amount: Number,
  store: {
    type: Schema.Types.ObjectId,
    ref: "Store"
  },
  collab: {
    type: Schema.Types.ObjectId,
    ref: "CollabStore"
  }
  
}, { timestamps: true })

module.exports = mongoose.model("Coupon", DataSchemaCoupon)