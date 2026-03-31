const express = require("express");
const router = express.Router();
const { authProtector, authorizeRoles } = require("../middlewares/authMiddleware");
const { 
    createPlot, 
    getAllPlots, 
    getMyPlots,
    getPlotById, 
    updatePlot, 
    deletePlot,
    searchPlots
} = require("../controllers/plotController");

// Create plot
router.post("/", authProtector, authorizeRoles("Farmer"), createPlot);

// Get all plots
router.get("/", getAllPlots);

// Search plots
router.get("/search", searchPlots);

// Get my plots (farmer only)
router.get("/my-plots", authProtector, authorizeRoles("Farmer"), getMyPlots);

// Get, update, delete specific plot
router.get("/:id", getPlotById);
router.put("/:id", authProtector, authorizeRoles("Farmer"), updatePlot);
router.delete("/:id", authProtector, authorizeRoles("Farmer"), deletePlot);

module.exports = router;