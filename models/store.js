const mongoose = require("mongoose")

const Schema = mongoose.Schema

const DataSchemaStore = new Schema({
  storename: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  collabs: [
    {
      type: Schema.Types.ObjectId,
      ref: "CollabStores"
    }
  ],
  coupons: [
    {
    type: Schema.Types.ObjectId,
    ref: "Coupon"
    }
  ]
}, { timestamps: true })

module.exports = mongoose.model("Store", DataSchemaStore)
