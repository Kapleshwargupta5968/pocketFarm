import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {useParams, useNavigate} from "react-router-dom"
import { getPlotById } from "../../services/plotService"
import {toast} from "react-toastify"
import {setSelectedPlot} from "../../features/plot/plotSlice"
import {createOrder, verifyPayment} from "../../services/paymentService"
import config from "../../config/config"

const PlotDetails = () => {
    const {id} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {selectedPlot} = useSelector((state)=>state.plot);
    const {user} = useSelector((state)=>state.auth);
    const [duration, setDuration] = useState(30);
    const [loading, setLoading] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(()=>{
        const fetchPlot = async () => {
            try{
            const response = await getPlotById(id);
            dispatch(setSelectedPlot(response.plot));
            }catch(error){
                toast.error(`Unable to fetch plot, ${error?.response?.data?.message}`);
            }
        }
        fetchPlot();
    }, [id, dispatch]);

    if(!selectedPlot){
        return (
          <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 bg-emerald-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-emerald-600 rounded-full animate-spin"></div>
            </div>
          </div>
        )
    }

    const totalImages = selectedPlot.images?.length || 0;
    const currentPrice = selectedPlot.price * (duration / 30);

    const handleSubscribe = async () => {
        try{
            setLoading(true);

            // Dynamically load Razorpay script
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

            const response = await createOrder({
                plotId: selectedPlot._id,
                duration
            });
            const orderData = response.order;

            const options = {
                key:config.razorpayKeyId,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "PocketFarm",
                description: `Subscription for Plot #${selectedPlot.plotNumber}`,
                order_id: orderData.id,
                handler: async (response) => {
                    try{
                        await verifyPayment({
                            ...response,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            plotId: selectedPlot._id,
                            duration
                        });
                        toast.success("Subscription successful! Redirecting to your subscriptions...");
                        setTimeout(() => {
                            navigate("/dashboard/my-subscriptions");
                        }, 1500);
                    } catch (error) {
                        toast.error(`Payment verification failed, ${error?.response?.data?.message}`);
                    }

                },

                prefill: {
                    name: user?.name,
                    email: user?.email
                },
                theme:{
                    color:"#16a34a"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        }catch(error){
            toast.error(`Subscription failed, ${error?.response?.data?.message}`);
        }finally{
            setLoading(false);
        }
    }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-linear-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <button
            onClick={() => navigate("/dashboard/plots")}
            className="flex items-center gap-2 text-emerald-100 hover:text-white transition mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Browse
          </button>
          <h1 className="text-4xl font-bold">Plot #{selectedPlot.plotNumber}</h1>
          <p className="text-emerald-100 mt-2">Explore and subscribe to this premium farming plot</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Info */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            {selectedPlot.images?.length > 0 && (
              <div className="mb-8">
                {/* Main Image */}
                <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg mb-4">
                  <img
                    src={selectedPlot.images[currentImageIndex]}
                    alt="Plot"
                    className="w-full h-96 object-cover"
                  />
                  {totalImages > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur hover:bg-white rounded-full p-2 transition"
                      >
                        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setCurrentImageIndex((prev) => (prev + 1) % totalImages)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur hover:bg-white rounded-full p-2 transition"
                      >
                        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium">
                        {currentImageIndex + 1} / {totalImages}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {totalImages > 1 && (
                  <div className="grid grid-cols-6 gap-2">
                    {selectedPlot.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-20 rounded-lg overflow-hidden border-2 transition ${
                          currentImageIndex === index
                            ? 'border-emerald-500 scale-105'
                            : 'border-gray-300 hover:border-emerald-300'
                        }`}
                      >
                        <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Plot Details Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Size Card */}
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-2">📐 Area</p>
                <p className="text-3xl font-bold text-gray-800">{selectedPlot.size}</p>
                <p className="text-gray-500 text-sm mt-1">Square meters</p>
              </div>

              {/* Status Card */}
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-2">📊 Status</p>
                <span className={`inline-block px-4 py-2 rounded-full font-bold text-sm ${
                  selectedPlot.status === 'Available'
                    ? 'bg-green-100 text-green-700'
                    : selectedPlot.status === 'Subscribed'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {selectedPlot.status}
                </span>
              </div>

              {/* Crop Card */}
              {selectedPlot.currentCrop && (
                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-2">🌾 Current Crop</p>
                  <p className="text-2xl font-bold text-gray-800">{selectedPlot.currentCrop}</p>
                </div>
              )}

              {/* Harvest Date Card */}
              {selectedPlot.expectedHarvestDate && (
                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-2">📅 Expected Harvest</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {new Date(selectedPlot.expectedHarvestDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Location Card */}
            <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 shadow-md mb-8 border border-blue-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">📍</span> Location
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm font-semibold mb-1">Latitude</p>
                  <p className="text-lg font-bold text-gray-800">{selectedPlot?.location?.coordinates?.[1]?.toFixed(6) || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold mb-1">Longitude</p>
                  <p className="text-lg font-bold text-gray-800">{selectedPlot?.location?.coordinates?.[0]?.toFixed(6) || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Farmer Info & Subscription */}
          <div className="lg:col-span-1">
            {/* Farmer Info Card */}
            <div className="bg-white rounded-3xl p-8 shadow-lg mb-6 border-t-4 border-t-emerald-500">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="text-2xl">👨‍🌾</span> Farmer Information
              </h3>
              <div className="space-y-4">
                <div className="pb-4 border-b border-gray-200">
                  <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1">Name</p>
                  <p className="text-lg font-bold text-gray-800">{selectedPlot?.farmer?.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1">Email</p>
                  <p className="text-lg font-semibold text-gray-700 break-all">{selectedPlot?.farmer?.email || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Subscription Card */}
            {user?.role === "Subscriber" && selectedPlot.status === "Available" && (
              <div className="bg-linear-to-br from-emerald-50 to-green-50 rounded-3xl p-8 shadow-lg border border-emerald-200">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Subscribe Now</h3>

                {/* Duration Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Duration
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-emerald-500 focus:outline-none transition font-semibold"
                  >
                    <option value={30}>30 days</option>
                    <option value={60}>60 days</option>
                    <option value={90}>90 days</option>
                  </select>
                </div>

                {/* Price Breakdown */}
                <div className="bg-white rounded-lg p-4 mb-6 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Base Price (30 days)</span>
                    <span className="font-semibold text-gray-800">₹{selectedPlot.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold text-gray-800">{duration} days</span>
                  </div>
                  <div className="border-t-2 border-gray-200 pt-2 flex justify-between items-center">
                    <span className="font-bold text-gray-800">Total Amount</span>
                    <span className="text-2xl font-bold text-emerald-600">₹{Math.round(currentPrice)}</span>
                  </div>
                </div>

                {/* Subscribe Button */}
                <button
                  onClick={handleSubscribe}
                  disabled={loading}
                  className="w-full bg-linear-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 disabled:scale-100 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Pay & Subscribe
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-600 text-center mt-4">
                  💳 Secure payment powered by Razorpay
                </p>
              </div>
            )}

            {/* Not Available Message */}
            {selectedPlot.status !== "Available" && (
              <div className="bg-red-50 rounded-3xl p-8 shadow-lg border border-red-200">
                <p className="text-red-700 font-bold text-center">
                  🚫 This plot is currently {selectedPlot.status.toLowerCase()} and cannot be subscribed
                </p>
              </div>
            )}

            {/* Not Subscriber Message */}
            {user?.role !== "Subscriber" && (
              <div className="bg-amber-50 rounded-3xl p-8 shadow-lg border border-amber-200">
                <p className="text-amber-700 font-bold text-center">
                  ⚠️ Only subscribers can book plots
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlotDetails
