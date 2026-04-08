import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getMyPayment, retryPayment, verifyPayment, getFarmerEarnings } from "../../services/paymentService";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import config from "../../config/config";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const isFarmer = user?.role === "Farmer";

  useEffect(() => {
    const fetchData = async () => {
      try{
        let response;
        if (isFarmer) {
          response = await getFarmerEarnings();
        } else {
          response = await getMyPayment();
        }
        setPayments(response?.earnings || response?.payments || []);
        setLoading(false);
      }catch(error){
        const errorMsg = error?.response?.data?.message || (isFarmer ? "Failed to fetch earnings" : "Failed to fetch payments");
        toast.error(errorMsg);
        setLoading(false);
      }
    };
    fetchData();
  }, [isFarmer]);

  const handleRetryPayment = async (paymentId, paymentData) => {
    try{
      const res = await new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });

      if (!res) {
        toast.error("Failed to load Razorpay SDK. Please check your internet connection.");
        return;
      }

      const response = await retryPayment(paymentId);
      
      if (!response?.success) {
        toast.error(response?.message || "Failed to create retry payment");
        return;
      }

      const orderData = response?.order;
      
      if (!orderData?.id || !orderData?.amount) {
        toast.error("Invalid payment order data received");
        return;
      }

      const options = {
        key: config.razorpayKeyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "PocketFarm",
        description: "Retry Payment",
        order_id: orderData.id,
        handler: async function (razorpayResponse){
          try{
            await verifyPayment({
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_signature: razorpayResponse.razorpay_signature,
              plotId: paymentData?.plot?._id,
              duration: paymentData?.duration
            });
            toast.success("Payment verified successfully!");
            const updatedResponse = await getMyPayment();
            setPayments(updatedResponse?.payments || []);
          }catch(error){
            toast.error(error?.response?.data?.message || "Payment verification failed");
          }
        },
        prefill: {}
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
    }catch(error){
      toast.error(error?.response?.data?.message || "Failed to retry payment");
    }
  };

  const getStatusColor = (status) => {
    const lowerStatus = status?.toLowerCase();
    if (lowerStatus === "success") return "bg-emerald-50 border-emerald-200";
    if (lowerStatus === "pending") return "bg-amber-50 border-amber-200";
    return "bg-red-50 border-red-200";
  };

  const getStatusBadgeColor = (status) => {
    const lowerStatus = status?.toLowerCase();
    if (lowerStatus === "success") return "bg-emerald-100 text-emerald-700";
    if (lowerStatus === "pending") return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-700";
  };

  const getStatusIcon = (status) => {
    const lowerStatus = status?.toLowerCase();
    if (lowerStatus === "success") return "✓";
    if (lowerStatus === "pending") return "⏳";
    return "✕";
  };

  const totalAmount = payments.reduce((sum, pay) => sum + (pay.amount || 0), 0);
  const successfulPayments = payments.filter(p => p.status?.toLowerCase() === "success").length;

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="bg-gray-200 rounded-xl h-64 animate-pulse"
        ></motion.div>
      ))}
    </div>
  );

  // Enhanced Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
        ease: "easeOut"
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const statVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
        damping: 15
      },
    },
    hover: {
      scale: 1.05,
      y: -8,
      transition: { duration: 0.3 },
      boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, rotate: -2 },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: { 
        duration: 0.6, 
        ease: "easeOut",
        type: "spring",
        stiffness: 80,
        damping: 15
      },
    },
    hover: {
      y: -12,
      rotate: 1,
      transition: { duration: 0.3 },
      boxShadow: "0 30px 60px rgba(0,0,0,0.15)"
    },
    tap: {
      scale: 0.98,
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.03,
      boxShadow: "0 15px 30px rgba(59, 130, 246, 0.4)"
    },
    tap: { scale: 0.95 },
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0, rotate: -180 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        delay: 0.3,
        type: "spring",
        stiffness: 150,
        damping: 12
      }
    }
  };

  const amountVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { delay: 0.35, duration: 0.5, ease: "easeOut" }
    }
  };

  const emailVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delay: 0.2, duration: 0.4 }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-6 md:p-8"
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          {isFarmer ? "Earnings Dashboard" : "Payment History"}
        </h1>
        <p className="text-slate-400 text-lg">
          {isFarmer 
            ? "Track earnings from your plot subscriptions" 
            : "Track and manage all your subscription payments"}
        </p>
      </motion.div>

      {/* Stats Section */}
      {payments.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {/* Total Amount */}
          <motion.div
            variants={statVariants}
            whileHover="hover"
            className={`${isFarmer 
              ? "bg-linear-to-br from-amber-600 to-amber-700" 
              : "bg-linear-to-br from-blue-600 to-blue-700"} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`${isFarmer ? "text-amber-100" : "text-blue-100"} text-sm font-medium mb-1`}>
                  {isFarmer ? "Total Earnings" : "Total Paid"}
                </p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold"
                >
                  ₹{(payments.reduce((sum, p) => sum + (p.amount || 0), 0)).toLocaleString()}
                </motion.p>
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="text-5xl opacity-30"
              >
                {isFarmer ? "💰" : "💳"}
              </motion.div>
            </div>
          </motion.div>

          {/* Count */}
          <motion.div
            variants={statVariants}
            whileHover="hover"
            className={`${isFarmer
              ? "bg-linear-to-br from-emerald-600 to-emerald-700"
              : "bg-linear-to-br from-emerald-600 to-emerald-700"} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium mb-1">
                  {isFarmer ? "Total Subscriptions" : "Successful"}
                </p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold"
                >
                  {isFarmer 
                    ? payments.length
                    : payments.filter(p => p.status?.toLowerCase() === "success").length}
                </motion.p>
              </div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-5xl opacity-30"
              >
                ✓
              </motion.div>
            </div>
          </motion.div>

          {/* Active/Status */}
          <motion.div
            variants={statVariants}
            whileHover="hover"
            className={`${isFarmer
              ? "bg-linear-to-br from-blue-600 to-blue-700"
              : "bg-linear-to-br from-amber-600 to-amber-700"} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`${isFarmer ? "text-blue-100" : "text-amber-100"} text-sm font-medium mb-1`}>
                  {isFarmer ? "Active" : "Pending"}
                </p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold"
                >
                  {isFarmer
                    ? payments.filter(p => p.status === "Active").length
                    : payments.filter(p => p.status?.toLowerCase() === "pending").length}
                </motion.p>
              </div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-5xl opacity-30"
              >
                {isFarmer ? "🔄" : "⏳"}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Payments Grid */}
      {loading ? (
        <LoadingSkeleton />
      ) : payments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-7xl mb-4"
          >
            {isFarmer ? "📊" : "📭"}
          </motion.div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {isFarmer ? "No Earnings Yet" : "No Payments Yet"}
          </h3>
          <p className="text-slate-400 text-center max-w-md">
            {isFarmer
              ? "Once your plots get subscribed, earnings will appear here."
              : "Start your farming journey by subscribing to a plot. Your payment history will appear here."}
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {payments.map((item, index) => {
            const displayItem = isFarmer ? item : item;
            const plotNum = isFarmer ? item.plot?.plotNumber : item.plot?.plotNumber;
            const subscriberName = isFarmer ? item.user?.name : null;
            const subscriberEmail = isFarmer ? item.user?.email : null;
            
            const cardDelay = index * 0.08;
            
            return (
              <motion.div
                key={item._id}
                variants={cardVariants}
                whileHover="hover"
                whileTap={{ scale: 0.98 }}
                transition={{ delay: cardDelay, type: "spring", stiffness: 80, damping: 15 }}
                className={`${getStatusColor(isFarmer ? item.status : item.status)} backdrop-blur-sm border rounded-xl p-6 hover:shadow-xl transition-all duration-300`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: cardDelay + 0.1, duration: 0.3 }}
                      className="text-slate-600 text-sm font-semibold mb-1"
                    >
                      {isFarmer ? "👤 Subscriber" : "🌾 Plot Subscription"}
                    </motion.p>
                    <motion.h3
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: cardDelay + 0.15, duration: 0.3 }}
                      className="text-2xl font-bold text-slate-900"
                    >
                      {isFarmer ? `${subscriberName}` : `Plot #${plotNum}`}
                    </motion.h3>
                  </div>
                  <motion.span
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ delay: cardDelay + 0.25, type: "spring", stiffness: 100, damping: 12 }}
                    className={`${getStatusBadgeColor(item.status)} px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1`}
                  >
                    <span>{getStatusIcon(item.status)}</span>
                    {item.status}
                  </motion.span>
                </div>

                {/* Email/Plot Details */}
                {isFarmer && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + cardDelay, duration: 0.4 }}
                    whileHover={{ x: 5 }}
                    className="mb-3 pb-3 border-b border-slate-300 border-opacity-40 cursor-pointer"
                  >
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 + cardDelay }}
                      className="text-slate-600 text-sm mb-1 font-semibold"
                    >
                      ✉️ Email
                    </motion.p>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.25 + cardDelay }}
                      className="text-slate-700 font-medium truncate hover:text-blue-600 transition-colors"
                    >
                      {subscriberEmail}
                    </motion.p>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + cardDelay }}
                      className="text-slate-600 text-sm mt-2 mb-1 font-semibold"
                    >
                      🌾 Plot
                    </motion.p>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.35 + cardDelay }}
                      className="text-slate-700 font-medium"
                    >
                      Plot #{plotNum}
                    </motion.p>
                  </motion.div>
                )}

                {/* Amount */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + cardDelay, duration: 0.4 }}
                  className="mb-4 pb-4 border-b border-slate-300 border-opacity-40"
                >
                  <p className="text-slate-600 text-sm mb-1 font-semibold">
                    {isFarmer ? "💰 Earned Amount" : "💳 Payment Amount"}
                  </p>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25 + cardDelay, type: "spring", stiffness: 100 }}
                    className="text-3xl font-bold text-slate-900"
                  >
                    ₹{item.amount?.toLocaleString()}
                  </motion.p>
                </motion.div>

                {/* Dates */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + cardDelay, duration: 0.4 }}
                  className="mb-5"
                >
                  <p className="text-slate-600 text-sm mb-2 font-semibold">
                    {isFarmer ? "📅 Subscription Dates" : "📅 Payment Date"}
                  </p>
                  {isFarmer ? (
                    <div className="space-y-2">
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 + cardDelay, duration: 0.3 }}
                        className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors"
                      >
                        <span>📍</span>
                        <span className="text-xs font-medium">Start: {new Date(item.startDate).toLocaleDateString('en-IN')}</span>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + cardDelay, duration: 0.3 }}
                        className="flex items-center gap-2 text-slate-700 hover:text-orange-600 transition-colors"
                      >
                        <span>🏁</span>
                        <span className="text-xs font-medium">End: {new Date(item.endDate).toLocaleDateString('en-IN')}</span>
                      </motion.div>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + cardDelay, duration: 0.3 }}
                      className="flex items-center gap-2 text-slate-700"
                    >
                      <span>⏰</span>
                      <span className="font-medium">{new Date(item.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </motion.div>
                  )}
                </motion.div>

                {/* Duration Info */}
                {isFarmer && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 + cardDelay, duration: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    className="mb-4 pb-4 border-t border-slate-300 border-opacity-40 pt-4 cursor-pointer"
                  >
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + cardDelay }}
                      className="text-slate-600 text-sm mb-1 font-semibold"
                    >
                      ⏱️ Duration
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.55 + cardDelay, type: "spring", stiffness: 100 }}
                      className="inline-block bg-linear-to-r from-blue-100 to-purple-100 text-slate-900 px-4 py-2 rounded-lg font-bold"
                    >
                      {item.duration} days
                    </motion.div>
                  </motion.div>
                )}

                {/* Button */}
                {!isFarmer && item.status?.toLowerCase() !== "success" && (
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => handleRetryPayment(item._id, item)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + cardDelay, duration: 0.4 }}
                    className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
                  >
                    <motion.span
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🔄
                    </motion.span>
                    Retry Payment
                  </motion.button>
                )}
                {!isFarmer && item.status?.toLowerCase() === "success" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + cardDelay, type: "spring", stiffness: 120 }}
                    className="w-full bg-emerald-100 text-emerald-700 font-semibold py-3 rounded-lg text-center"
                  >
                    ✓ Payment Completed
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Payments;
