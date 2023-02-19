const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { connectMongoDB } = require("../../configs/mongo-setup");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      min: 6,
      required: true,
    },
    countryCode: {
      type: String,
      default: "+91",
    },
    phoneNumber: {
      type: Number,
      max: 10,
      unique: true,
    },
    address: {
      primary: {
        line1: {
          type: String,
        },
        line2: {
          type: String,
        },
        locality: {
          type: Number,
        },
        pincode: {
          type: Number,
        },
        city: {
          type: String,
        },
        state: {
          type: String,
        },
        country: {
          type: String,
        },
      },
      secondary: {
        line1: {
          type: String,
        },
        line2: {
          type: String,
        },
        locality: {
          type: Number,
        },
        pincode: {
          type: Number,
        },
        city: {
          type: String,
        },
        state: {
          type: String,
        },
        country: {
          type: String,
        },
      },
    },
    points: {
      type: Number,
      default: 100,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isSeller: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "delete"],
      default: "active",
    },
    userId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Users = connectMongoDB.model("Users", userSchema);
module.exports = Users;
