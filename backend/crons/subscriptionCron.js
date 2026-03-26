const cron = require("node-cron");
const Subscription = require("../models/subscription");
const Plot = require("../models/plot");


cron.schedule("0 0 * * *", async () => {
    console.log("Running subscription expiry job...");
    
    const expiredSubscriptions = await Subscription.find({
        endDate:{$lt: new Date()},
        status:"Active"
    });

    for(let sub of expiredSubscriptions){
        sub.status = "Completed",
        await sub.save();

        const plot = await Plot.findById(sub.plot);
        if(plot){
            plot.status = "Available",
            await plot.save();
        }
    }
    console.log(`Processed ${expiredSubscriptions.length} expired subscriptions`);
});

module.exports = cron;