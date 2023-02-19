const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// configs
const { connectMongoDB } = require("../../configs/mongo-setup");

const cartSchema = new Schema(
  {
    cartId: {
      type: String,
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    item: [
      {
        itemId: {
          type: Schema.Types.ObjectId,
          ref: "Items",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          required: true,
        },
        currencyCode: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        sellerId: {
          type: Schema.Types.ObjectId,
          ref: "Users",
          required: true,
        },
      },
    ],
    cartQuanity: {
      type: Number,
      default: 1,
      required: true,
    },
    cartTotalAmount: {
      type: Number,
      default: 0,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "deleted"],
      default: "active",
      required: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Orders",
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Cart = connectMongoDB.model("Cart", cartSchema);
module.exports = Cart;
