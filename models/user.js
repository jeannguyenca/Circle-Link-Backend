const mongoose = require("mongoose")

const Schema = mongoose.Schema

const DataSchemaUser = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String, 
    enum: ["admin", "store", "user"],
    default: "user"
  },
  name: String,
  address:  String,
  points: Number,
  redeemed: [
    {
      type: Schema.Types.ObjectId,
      ref: "RedeemedCoupon"
    }
  ],
  createdStores: [
    {
      type: Schema.Types.ObjectId,
      ref: "Store"
    }
  ]
}, { timestamps: true })

module.exports = mongoose.model("User", DataSchemaUser)
