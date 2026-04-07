const Plot = require("../models/plot");
const Subscription = require("../models/subscription");

const getDashboardStats = async (req, res) => {
    try {
        const user = req.user;

        if (user.role === "Farmer") {
            const totalPlots = await Plot.countDocuments({ farmer: user._id });
            
            const activeSubscriptions = await Subscription.aggregate([
                {
                    $lookup: {
                        from: "plots",
                        localField: "plot",
                        foreignField: "_id",
                        as: "plotDetails"
                    }
                },
                {
                    $unwind: "$plotDetails"
                },
                {
                    $match: {
                        "plotDetails.farmer": user._id,
                        status: "Active"
                    }
                },
                {
                    $count: "count"
                }
            ]);

            const earningData = await Subscription.aggregate([
                {
                    $lookup: {
                        from: "plots",
                        localField: "plot",
                        foreignField: "_id",
                        as: "plotDetails"
                    }
                },
                {
                    $unwind: "$plotDetails"
                },
                {
                    $match: {
                        "plotDetails.farmer": user._id,
                        status: "Active"
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalEarnings: { $sum: "$amount" }
                    }
                }
            ]);

            const activeCount = activeSubscriptions.length > 0 ? activeSubscriptions[0].count : 0;
            const earnings = earningData.length > 0 ? earningData[0].totalEarnings : 0;

            return res.status(200).json({
                success: true,
                totalPlots,
                activeSubscriptions: activeCount,
                earnings,
                pendingRequests: 0
            });
        }

        if (user.role === "Subscriber") {
            const subscribedPlots = await Subscription.countDocuments({
                user: user._id,
                status: "Active"
            });

            const activePlans = await Subscription.countDocuments({
                user: user._id,
                status: "Active"
            });

            const spendingData = await Subscription.aggregate([
                {
                    $match: {
                        user: user._id,
                        status: "Active"
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalSpent: { $sum: "$amount" }
                    }
                }
            ]);

            const totalSpent = spendingData.length > 0 ? spendingData[0].totalSpent : 0;

            return res.status(200).json({
                success: true,
                subscribedPlots,
                activePlans,
                totalSpent
            });
        }

        return res.status(403).json({
            success: false,
            message: "Unauthorized access"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error, due to this ${error.message} reason`
        });
    }
};

const getEarningData = async (req, res) => {
    try {
        const user = req.user;

        if (user.role !== "Farmer") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        const earnings = await Subscription.aggregate([
            {
                $match: { status: "Active" }
            },
            {
                $lookup: {
                    from: "plots",
                    localField: "plot",
                    foreignField: "_id",
                    as: "plotDetails"
                }
            },
            {
                $unwind: "$plotDetails"
            },
            {
                $match: {
                    "plotDetails.farmer": user._id
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$startDate" },
                        month: { $month: "$startDate" }
                    },
                    totalEarnings: { $sum: "$amount" }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        const formatted = earnings.map(items => {
            const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][items._id.month - 1];
            return {
                month: `${month} ${items._id.year}`,
                totalEarnings: items.totalEarnings
            };
        });

        return res.status(200).json({
            success: true,
            data: formatted
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error, due to this ${error.message} reason`
        });
    }
};

const getDashboardTable = async (req, res) => {
    try {
        const user = req.user;

        if (user.role === "Farmer") {
            // Get all plots for the farmer with subscription counts and earnings
            const plots = await Plot.aggregate([
                {
                    $match: { farmer: user._id }
                },
                {
                    $lookup: {
                        from: "subscriptions",
                        localField: "_id",
                        foreignField: "plot",
                        as: "subscriptions"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        currentCrop: 1,
                        status: 1,
                        price: 1,
                        subscriptionCount: {
                            $size: {
                                $filter: {
                                    input: "$subscriptions",
                                    as: "sub",
                                    cond: { $eq: ["$$sub.status", "Active"] }
                                }
                            }
                        },
                        activeSubscriptions: {
                            $filter: {
                                input: "$subscriptions",
                                as: "sub",
                                cond: { $eq: ["$$sub.status", "Active"] }
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        totalEarnings: {
                            $sum: "$activeSubscriptions.amount"
                        }
                    }
                }
            ]);

            const formatted = plots.map(plot => ({
                plotId: plot._id,
                crop: plot.currentCrop || "N/A",
                status: plot.status,
                subscriptionCount: plot.subscriptionCount,
                price: plot.price,
                totalEarnings: plot.totalEarnings || 0
            }));

            return res.status(200).json({
                success: true,
                data: formatted
            });
        }

        if (user.role === "Subscriber") {
            const subscriptions = await Subscription.aggregate([
                {
                    $match: { user: user._id }
                },
                {
                    $lookup: {
                        from: "plots",
                        localField: "plot",
                        foreignField: "_id",
                        as: "plotDetails"
                    }
                },
                {
                    $unwind: "$plotDetails"
                },
                {
                    $project: {
                        _id: 1,
                        plotId: "$plotDetails._id",
                        crop: "$plotDetails.currentCrop",
                        status: "$status",
                        price: "$amount"
                    }
                }
            ]);

            const formatted = subscriptions.map(sub => ({
                plotId: sub.plotId,
                crop: sub.crop || "N/A",
                status: sub.status,
                price: sub.price
            }));

            return res.status(200).json({
                success: true,
                data: formatted
            });
        }

        return res.status(403).json({
            success: false,
            message: "Unauthorized access"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error, due to this ${error.message} reason`
        });
    }
};

module.exports = { getDashboardStats, getEarningData, getDashboardTable };