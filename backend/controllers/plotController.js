const Plot = require("../models/plot");

const createPlot = async (req, res) => {
  try {
    const {
      plotNumber,
      size,
      price,
      currentCrop,
      sowingDate,
      expectedHarvestDate
    } = req.body;

    if (!plotNumber || !size || !price) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    if (size <= 0) {
      return res.status(400).json({
        success: false,
        message: "Size must be greater than 0"
      });
    }

    if (price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be greater than 0"
      });
    }

    if (sowingDate && expectedHarvestDate && sowingDate > expectedHarvestDate) {
      return res.status(400).json({
        success: false,
        message: "Harvest date must be after sowing date"
      });
    }

    const existingPlot = await Plot.findOne({ plotNumber });

    if (existingPlot) {
      return res.status(400).json({
        success: false,
        message: "Plot already exists"
      });
    }

    const plot = await Plot.create({
      plotNumber,
      size,
      price,
      currentCrop,
      sowingDate,
      expectedHarvestDate,
      farmer: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "Plot created successfully",
      plot
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const getAllPlots = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const plots = await Plot.find({ status: { $ne: "Inactive" } })
      .skip(skip)
      .limit(limit)
      .populate("farmer", "name email");

    res.status(200).json({
      success: true,
      page,
      count: plots.length,
      plots
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const getPlotById = async (req, res) => {
  try {
    const plot = await Plot.findById(req.params.id)
      .populate("farmer", "name email");

    if (!plot) {
      return res.status(404).json({
        success: false,
        message: "Plot not found"
      });
    }

    res.status(200).json({
      success: true,
      plot
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const updatePlots = async (req, res) => {
  try {

    const plot = await Plot.findById(req.params.id);

    if (!plot) {
      return res.status(404).json({
        success: false,
        message: "Plot not found"
      });
    }

    if (plot.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access"
      });
    }

    if (req.body.price && req.body.price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be greater than 0"
      });
    }

    if (req.body.size && req.body.size <= 0) {
      return res.status(400).json({
        success: false,
        message: "Size must be greater than 0"
      });
    }

    const allowedUpdates = [
      "size",
      "price",
      "currentCrop",
      "sowingDate",
      "expectedHarvestDate"
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        plot[field] = req.body[field];
      }
    });

    const updatedPlot = await plot.save();

    res.status(200).json({
      success: true,
      message: "Plot updated successfully",
      updatedPlot
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const deletePlot = async (req, res) => {
  try {

    const plot = await Plot.findById(req.params.id);

    if (!plot) {
      return res.status(404).json({
        success: false,
        message: "Plot not found"
      });
    }

    if (plot.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access"
      });
    }

    plot.status = "Inactive";

    await plot.save();

    res.status(200).json({
      success: true,
      message: "Plot deactivated successfully (soft delete)"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  createPlot,
  getAllPlots,
  getPlotById,
  updatePlots,
  deletePlot
};