import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMySubscriptions, cancelSubscription } from "../../services/subscriptionService";
import { setSubscriptions, removeSubscription } from "../../features/subscription/subscriptionSlice";
import { toast } from "react-toastify";

const MySubscriptions = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {subscriptions, loading, activeCount} = useSelector((state)=>state.subscription);
    const [isRefetching, setIsRefetching] = useState(false);
    const [cancellingId, setCancellingId] = useState(null);

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
        setCancellingId(id);
        dispatch(removeSubscription(id));
        try{
            await cancelSubscription(id);
            toast.success("Subscription cancelled successfully");
        }catch(error){
            toast.error("Failed to cancel subscription", error?.response?.data?.message);
        }finally{
            setCancellingId(null);
        }
    };

    const activeSubscriptions = subscriptions.filter(sub => sub.status?.toLowerCase() === 'active');
    
    const getDaysRemaining = (endDate) => {
      const today = new Date();
      const end = new Date(endDate);
      const diff = end - today;
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      {/* Header Section */}
      <div className="bg-linear-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-2">My Subscriptions</h1>
          <p className="text-green-100 text-lg">Manage and monitor all your active plot subscriptions</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Top Controls */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-2xl font-bold text-gray-800">
            Active Subscriptions: <span className="text-green-600">{activeCount}</span>
          </div>
          <button
            onClick={fetchSubscriptions}
            disabled={isRefetching}
            className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all font-semibold shadow-md"
          >
            <svg
              className={`w-5 h-5 ${isRefetching ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {isRefetching ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 bg-green-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-green-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600 font-medium">Loading subscriptions...</p>
          </div>
        ) : activeSubscriptions.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl shadow-lg p-16 text-center">
            <div className="text-7xl mb-6">🌿</div>
            <h3 className="text-3xl font-bold text-gray-800 mb-3">No Active Subscriptions</h3>
            <p className="text-gray-600 text-lg mb-8">Start exploring and subscribe to premium farm plots to see them here</p>
            <a
              href="/dashboard/plots"
              className="inline-block px-8 py-3 bg-linear-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all"
            >
              Browse Plots
            </a>
          </div>
        ) : (
          /* Subscriptions Grid */
          <div className="grid grid-cols-1 gap-6">
            {activeSubscriptions.map((subscription) => {
              // Check if plot data exists
              if (!subscription.plot) {
                return (
                  <div key={subscription._id || subscription.id} className="bg-white rounded-3xl shadow-lg p-8 text-center border-2 border-red-200">
                    <p className="text-red-600 font-bold text-lg">⚠️ Error: Plot data not found</p>
                    <p className="text-gray-600 text-sm mt-2">Please refresh or contact support</p>
                  </div>
                );
              }

              const daysRemaining = getDaysRemaining(subscription.endDate);
              const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;
              
              return (
                <div
                  key={subscription._id || subscription.id}
                  className="group bg-linear-to-br from-white to-slate-50 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-emerald-200"
                >
                  {/* Top Accent */}
                  <div className="h-2 bg-linear-to-r from-emerald-500 to-green-500"></div>

                  <div className="p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-8">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                          Plot #{subscription.plot?.plotNumber || "N/A"}
                        </h2>
                        <p className="text-gray-600 font-medium">
                          Farmer: {subscription.plot?.farmer?.name || "N/A"}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <span className="px-4 py-2 rounded-full text-sm font-bold bg-linear-to-r from-green-100 to-emerald-100 text-green-700">
                          ✓ Active
                        </span>
                        {isExpiringSoon && (
                          <span className="px-4 py-2 rounded-full text-sm font-bold bg-linear-to-r from-amber-100 to-amber-200 text-amber-700 animate-pulse">
                            ⚠️ Expiring Soon
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Main Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                      {/* Crop */}
                      <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-2xl p-4">
                        <p className="text-amber-700 text-xs font-bold uppercase tracking-wider mb-2">🌾 Crop</p>
                        <p className="text-gray-800 font-bold text-lg">{subscription.plot?.currentCrop || "N/A"}</p>
                      </div>

                      {/* Size */}
                      <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-2xl p-4">
                        <p className="text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">📐 Size</p>
                        <p className="text-gray-800 font-bold text-lg">{subscription.plot?.size}</p>
                      </div>

                      {/* Price */}
                      <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl p-4">
                        <p className="text-green-700 text-xs font-bold uppercase tracking-wider mb-2">💰 Price</p>
                        <p className="text-green-600 font-bold text-xl">₹{subscription.plot?.price?.toLocaleString()}</p>
                      </div>

                      {/* Days Remaining */}
                      <div className={`bg-linear-to-br rounded-2xl p-4 ${isExpiringSoon ? 'from-red-50 to-rose-50' : 'from-purple-50 to-pink-50'}`}>
                        <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${isExpiringSoon ? 'text-red-700' : 'text-purple-700'}`}>
                          📅 Days Left
                        </p>
                        <p className={`font-bold text-xl ${isExpiringSoon ? 'text-red-600' : 'text-purple-600'}`}>
                          {daysRemaining > 0 ? daysRemaining : "Expired"}
                        </p>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-linear-to-r from-slate-100 to-slate-50 rounded-2xl p-4 mb-8">
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <p className="text-gray-600 text-xs font-semibold mb-1">START DATE</p>
                          <p className="text-gray-800 font-bold">
                            {new Date(subscription.startDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                        <div className="flex-1 mx-4 h-1 bg-linear-to-r from-green-400 to-emerald-400"></div>
                        <div>
                          <p className="text-gray-600 text-xs font-semibold mb-1">END DATE</p>
                          <p className="text-gray-800 font-bold">
                            {new Date(subscription.endDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {subscription.status?.toLowerCase() === 'active' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleCancel(subscription._id || subscription.id)}
                          disabled={cancellingId === (subscription._id || subscription.id)}
                          className="flex-1 bg-linear-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 disabled:scale-100"
                        >
                          {cancellingId === (subscription._id || subscription.id) ? (
                            <span className="flex items-center justify-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Cancelling...
                            </span>
                          ) : (
                            "Cancel Subscription"
                          )}
                        </button>
                        <button 
                          className="flex-1 bg-linear-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105" 
                          onClick={() => {
                            if (subscription.plot?._id) {
                              navigate(`/dashboard/plots/${subscription.plot._id}`);
                            } else {
                              toast.error("Plot ID not found");
                            }
                          }}
                        >
                          View Plot
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySubscriptions;
