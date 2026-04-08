import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMySubscriptions, cancelSubscription } from "../../services/subscriptionService";
import { setSubscriptions, removeSubscription } from "../../features/subscription/subscriptionSlice";
import { toast } from "react-toastify";
const MySubscriptions = () => {
    const dispatch = useDispatch();
    const {subscriptions, loading} = useSelector((state)=>state.subscription);
    const [isRefetching, setIsRefetching] = useState(false);

    const fetchSubscriptions = async () => {
        try{
            setIsRefetching(true);
            const response = await getMySubscriptions();
            dispatch(setSubscriptions(response?.subscriptions || []));
        }catch(error){
            toast.error("Failed to fetch subscriptions", error);
        }finally{
            setIsRefetching(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, [dispatch]);

    const handleCancel = async (id) => {
        const confirm = window.confirm("Are you sure you want to cancel this subscription?");
        if(!confirm) return;
        dispatch(removeSubscription(id));
        try{
            await cancelSubscription(id);
            toast.success("Subscription cancelled successfully");
        }catch(error){
            toast.error("Failed to cancel subscription", error?.response?.data?.message);
        }
    };
  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">My Subscriptions</h1>
          <button
            onClick={fetchSubscriptions}
            disabled={isRefetching}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRefetching ? "Refreshing..." : "Refresh"}
          </button>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : subscriptions.length === 0 ? (
          <p>You have no subscriptions yet.</p>
        ) : (
            <div className="space-y-4">
              {subscriptions.map((subscription) => (
                <div key={subscription._id || subscription.id} className="border p-4">
                  <h2 className="text-lg font-semibold">{subscription.plot?.plotNumber}</h2>
                  <p>Crop: {subscription.plot?.currentCrop || "N/A"}</p>
                  <p>Size: {subscription.plot?.size}</p>
                  <p>Price: ${subscription.plot?.price?.toFixed(2)}</p>
                  <p>Status: {""}
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${subscription.status?.toLowerCase() === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                      {subscription.status}
                    </span>
                  </p>
                  <p>
                    Start : {""}
                    {new Date(subscription.startDate).toLocaleDateString()}
                  </p>
                  <p>
                    End : {""}
                    {new Date(subscription.endDate).toLocaleDateString()}
                  </p>

                  {subscription.status?.toLowerCase() === 'active' && (        
                  <button
                    onClick={() => handleCancel(subscription._id || subscription.id)}
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                  >
                    Cancel Subscription
                  </button>
                )}
                </div>
              ))}
            </div>
          )}

      </div>
    </>
  )
}

export default MySubscriptions
