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
  points: {
    type: Number,
    default: 0
  },
  avatarURL: {
    type: String,
    default: "https://firebasestorage.googleapis.com/v0/b/circlelink-eb07a.appspot.com/o/profile.png?alt=media&token=e260d7bc-4758-43d4-b5fb-9dc4867a3a0b"
  },
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
