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
  createDate: {
    type: Date,
    required: true
  },
  creator: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }


})

module.exports = mongoose.model("Store", DataSchemaStore)
