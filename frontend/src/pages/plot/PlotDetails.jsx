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
        return <p className="p-6">Loading...</p>
    }

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
    <>
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Plot #{selectedPlot.plotNumber}</h1>

        {
            selectedPlot.images?.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mb-6">
                    {
                        selectedPlot.images.map((img, index) => (
                            <img
                            key={index}
                            src={img}
                            alt="Plot image"
                            className="w-full h-48 object-cover rounded-lg shadow" />
                        ))
                    }
                </div>
            )
        }

        <div className="bg-white shadow rounded p-4 space-y-2">
            <p><strong>Size:</strong>{selectedPlot.size}</p>
            <p><strong>Price:</strong>{selectedPlot.price}</p>
            <p><strong>Status:</strong>{selectedPlot.status}</p>

            {
                selectedPlot.sowingDate && (
                    <p>
                        <strong>Harvest Date:</strong>{" "}
                        {new Date(selectedPlot.expectedHarvestDate).toLocaleDateString()}
                    </p>
                )
            }
            <hr/>
            <h2 className="font-semibold">Farmer Info</h2>
            <p>Name: {selectedPlot?.farmer?.name}</p>
            <p>Email: {selectedPlot?.farmer?.email}</p>

            <hr/>
            <h2 className="font-semibold">Location</h2>
            <p>
                Lat: {selectedPlot?.location?.coordinates?.[1] || "N/A"} | Lng: {" "}
                {selectedPlot?.location?.coordinates?.[0] || "N/A"}
            </p>
        </div>
        {
            user?.role === "Subscriber" && selectedPlot.status === "Available" && (
                <div className="mt-6 bg-white shadow rounded p-4">
                    <h2 className="text-lg font-semibold mb-4">Subscribe to this plot</h2>
                    <div className="mb-4">
                        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                            Duration (days):
                        </label>
                      <select name="duration" id="duration" value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                            <option value={30}>30 days</option>
                            <option value={60}>60 days</option>
                            <option value={90}>90 days</option>
                        </select>
                    </div>
                    <button
                        onClick={handleSubscribe}
                        disabled={loading}
                        className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading ? "Processing..." : "Pay & Subscribe"}
                    </button>
                </div>

            )
        }
      </div>
    </>
  )
}

export default PlotDetails
