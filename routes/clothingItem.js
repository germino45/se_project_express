const router = require("express").Router();
const {
  getItems,
  postItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem.js");

router.get("/", getItems);

router.post("/", postItem);

router.delete("/:itemId", deleteItem);

router.put("/:itemId/likes", likeItem);

router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
