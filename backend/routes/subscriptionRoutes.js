const express = require("express");
const router = express.Router();
const {subscribePlot,
    getSubscriptions,
    cancelSubscription} = require("../controllers/subscriptionController");

    const {authProtector} = require("../middlewares/authMiddleware");

    router.post("/subscribe", authProtector, subscribePlot);
    router.get("/", authProtector, getSubscriptions);
    router.delete("/:id/cancel", authProtector, cancelSubscription);

    module.exports = router;