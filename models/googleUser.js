const mongoose = require("mongoose")

const Schema = mongoose.Schema

const DataSchemaGoogle = new Schema(
  {
    access_token: {
      type: String,
      required: true
    },
    id_token: {
      type: String,
      required: true
    },
    expires_in: {
      type: Date,
      required: true
    },
    refresh_token: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("GoogleUser", DataSchemaGoogle)
