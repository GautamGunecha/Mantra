const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// configs
const { connectMongoDB } = require("../../configs/mongo-setup");

const itemSchema = new Schema(
  {
    itemId: {
      type: String,
      required: true,
      unique: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    itemDescription: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      required: true,
    },
    sku: {
      type: Number,
      required: true,
    },
    skuType: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    currencyCode: {
      type: String,
      enum: ["inr", "usd"],
      default: "inr",
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Items = connectMongoDB.model("Items", itemSchema);
module.exports = Items;
