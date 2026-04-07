import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {useParams} from "react-router-dom"
import { getPlotById } from "../../services/plotService";
import {toast} from "react-toastify"
import {setSelectedPlot} from "../../features/plot/plotSlice"
import { subscribeToPlot } from "../../services/subscriptionService";
const PlotDetails = () => {
    const {id} = useParams();
    const dispatch = useDispatch();

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
            const dummyPaymentId = "6441fff1c9d440016c5b8b2";
            await subscribeToPlot({plotId: id, duration, paymentId: dummyPaymentId});
            toast.success("Subscribed successfully!");
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
                Lat: {selectedPlot?.location?.coordinates[1]} | Lng: {" "}
                {selectedPlot?.location?.coordinates[0]}
            </p>
        </div>
        {
            user?.role === "Subscriber" && selectedPlot.status === "available" && (
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
                        {loading ? "Subscribing..." : "Subscribe"}
                    </button>
                </div>

            )
        }
      </div>
    </>
  )
}

export default PlotDetails
