const mongoose = require("mongoose");

//& create Cart schema
const CartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    desc: [
      {
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
