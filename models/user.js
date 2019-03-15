const mongoose = require("mongoose")

const Schema = mongoose.Schema

const DataSchemaUser = new Schema(
  {
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
    address: String,
    points: {
      type: Number,
      default: 100
    },
    avatarURL: {
      type: String,
      default:
        "https://firebasestorage.googleapis.com/v0/b/circlelink-eb07a.appspot.com/o/user%2Fprofile.png?alt=media&token=2bfbf23d-d728-48b8-9bc4-b7ddf8b89670"
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
  },
  { timestamps: true }
)

module.exports = mongoose.model("User", DataSchemaUser)
