const { Schema, model } = require("mongoose");

const orderSchema = new Schema({
  books: [
    {
      book: {
        type: Object,
        required: true,
      },
      count: {
        type: Number,
        required: true,
      },
    },
  ],
  user: {
    name: String,
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },

  date: {
    type: Date,
    dafault: Date.now,
  },
});

module.exports = model("Order", orderSchema);
