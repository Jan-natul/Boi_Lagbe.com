const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    author: String,
    genre: String,
    location: String,
    description: String,

    transactionType: {
      type: String,
      enum: ["resell", "exchange"], 
      required: true,
    },

    price: {
      type: Number,
      required: function () {
        return this.transactionType === "resell";
      },
    },

    image: {
      type: String, 
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", 
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("posts", postSchema);