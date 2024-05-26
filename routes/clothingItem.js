const router = require("express").Router();

const auth = require("../middlewares/auth");

const {
  getItems,
  postItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

const {
  clothingItemValidator,
  idValidator,
} = require("../middlewares/validation");

router.get("/", getItems);

router.post("/", auth, clothingItemValidator, postItem);

router.delete("/:itemId", auth, idValidator, deleteItem);

router.put("/:itemId/likes", auth, idValidator, likeItem);

router.delete("/:itemId/likes", auth, idValidator, dislikeItem);

module.exports = router;
