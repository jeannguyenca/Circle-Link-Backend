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
  address:  String,
  dob: Date,
  points: Number,
  stores: [
    {
      type: Schema.Types.ObjectId,
      ref: "Store"
    }
]
})

module.exports = mongoose.model("User", DataSchemaUser)
