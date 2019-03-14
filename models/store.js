const mongoose = require("mongoose")

const Schema = mongoose.Schema

const DataSchemaStore = new Schema(
  {
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
    storeCover: {
      type: String,
      default:
        "https://firebasestorage.googleapis.com/v0/b/circlelink-eb07a.appspot.com/o/store%2Fclothing-store-984396_1920.jpg?alt=media&token=388a6cfc-b25f-4763-9081-8f85235c0bc8"
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
  },
  { timestamps: true }
)

module.exports = mongoose.model("Store", DataSchemaStore)
