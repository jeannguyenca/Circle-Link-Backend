const mongoose = require("mongoose")

const Schema = mongoose.Schema

const DataSchemaCollabStore = new Schema({
  store: {
    type: Schema.Types.ObjectId,
    ref: "Store"
  },
  collab:{
    type: Schema.Types.ObjectId,
    ref: "Store"
  },
  coupons: {
    type: Schema.Types.ObjectId,
    ref: "Coupon"
  }
}, { timestamps: true })

module.exports = mongoose.model("CollabStore", DataSchemaCollabStore)
