const express = require("express");
const Item = require("../item");
const router = express.Router();

router.get("/", (req, res, next) => {
  try {
    return res.json({ items: Item.getAll() });
  } catch (err) {
    return next(err);
  }
});

router.get("/:name", (req, res, next) => {
  let response = Item.get(req.params.name);
  if (response instanceof Error) return next(response);
  return res.json({ item: response });
});

router.post("/", (req, res, next) => {
  try {
    let item = new Item(req.body.name, req.body.price);
    Item.updateDb();
    return res.json({ added: item });
  } catch (err) {
    return next(err);
  }
});

router.patch("/:name", (req, res, next) => {
  let response = Item.update(req.params.name, req.body);
  if (response instanceof Error) return next(response);
  return res.json({ updated: response });
});

router.delete("/:name", (req, res, next) => {
  try {
    Item.delete(req.params.name);
    return res.json({ message: "Deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
