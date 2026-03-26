const express = require(express);
const router = express.Router();
const {subscribePlot,
    getSubscriptions,
    cancelSubscription} = require("../controllers/subscriptionController");

    const {autProtector} = require("../middlewares/authMiddleware");

    router.post("/subscribe", autProtector, subscribePlot);
    router.get("/", autProtector, getSubscriptions);
    router.delete("/:id/cancel", autProtector, cancelSubscription);

    module.exports = router;