const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getItems,
  postItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

router.get("/", getItems);

router.post("/", auth, postItem);

router.delete("/:itemId", auth, deleteItem);

router.put("/:itemId/likes", auth, likeItem);

router.delete("/:itemId/likes", auth, dislikeItem);

module.exports = router;
