const { Router } = require("express");
const Order = require("../models/Order");
const router = Router();

router.get("/", async (req, res) => {
  const orders = await Order.find({ "user.userId": req.user._id }).populate(
    "user.userId"
  );

  console.log(orders);

  const forPrice = orders.map((c) => {
    return {
      ...c._doc,
      price: c.books.reduce((total, b) => {
        return (total += b.book.price * b.count);
      }, 0),
    };
  });

  res.render("orders", {
    title: "Order",
    orders: forPrice,
  });
});

router.post("/", async (req, res) => {
  try {
    const user = await req.user.populate("cart.items.bookId");

    const books = user.cart.items.map((c) => {
      return {
        count: c.count,
        book: { ...c.bookId._doc },
      };
    });

    const order = new Order({
      books,
      user: {
        name: req.user.name,
        userId: req.user,
      },
    });

    await order.save();
    await req.user.clearCart();

    res.redirect("/orders");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
