const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { connectMongoDB } = require("../../configs/mongo-setup");

const orderSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Orders = connectMongoDB.model("Orders", orderSchema);
module.exports = Orders;
