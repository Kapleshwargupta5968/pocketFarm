import { useEffect, useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import { getAllPlots } from "../../services/plotService";
import { setPlots } from "../../features/plot/plotSlice";
import { useNavigate } from "react-router-dom";

const PlotList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {plots = []} = useSelector((state) => state.plot);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    const fetchPlots = async () => {
      setIsLoading(true);
      try{
        const response = await getAllPlots();
        dispatch(setPlots(response?.plots || []));
      }catch(error){
        console.error("Error fetching plots:", error);
      }finally{
        setIsLoading(false);
      }
    };

    useEffect(()=>{
      fetchPlots();
    }, [dispatch]);

    const handleRefresh = (e) => {
      e.preventDefault();
      fetchPlots();
    };

    const filteredPlots = plots.filter(plot => {
      const matchesSearch = plot.plotNumber?.toString().includes(searchTerm) || 
                           plot.currentCrop?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === "all" || plot.status === filterStatus;
      return matchesSearch && matchesFilter;
    });

    const stats = {
      total: plots.length,
      available: plots.filter(p => p.status === "Available").length,
      subscribed: plots.filter(p => p.status === "Subscribed").length,
    };

    const getStatusColor = (status) => {
      switch(status) {
        case "Available":
          return "from-emerald-400 to-teal-500";
        case "Subscribed":
          return "from-blue-400 to-indigo-500";
        default:
          return "from-gray-400 to-gray-500";
      }
    };

    const getStatusBadgeColor = (status) => {
      switch(status) {
        case "Available":
          return "bg-emerald-100 text-emerald-700";
        case "Subscribed":
          return "bg-blue-100 text-blue-700";
        default:
          return "bg-gray-100 text-gray-700";
      }
    };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      {/* Header Section */}
      <div className="bg-linear-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-2">Browse Plots</h1>
          <p className="text-emerald-100 text-lg">Discover and subscribe to premium farming plots</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-linear-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Total Plots</p>
                <p className="text-4xl font-bold mt-2">{stats.total}</p>
              </div>
              <div className="text-5xl opacity-20">🌾</div>
            </div>
          </div>
          <div className="bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Available</p>
                <p className="text-4xl font-bold mt-2">{stats.available}</p>
              </div>
              <div className="text-5xl opacity-20">✅</div>
            </div>
          </div>
          <div className="bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Subscribed</p>
                <p className="text-4xl font-bold mt-2">{stats.subscribed}</p>
              </div>
              <div className="text-5xl opacity-20">📋</div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search by plot number or crop..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-emerald-500 focus:outline-none transition-colors"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-emerald-500 focus:outline-none transition-colors"
            >
              <option value="all">All Status</option>
              <option value="Available">Available</option>
              <option value="Subscribed">Subscribed</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all font-semibold shadow-md"
            >
              <svg
                className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`}
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
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Plots Grid */}
        {!Array.isArray(filteredPlots) || filteredPlots.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No plots found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlots.map((plot) => (
              <div
                key={plot._id}
                onClick={() => navigate(`/dashboard/plots/${plot._id}`)}
                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
              >
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden bg-linear-to-br from-slate-200 to-slate-300">
                  {plot.images?.[0] && (
                    <img
                      src={plot.images[0]}
                      alt="Plot image"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white backdrop-blur-md bg-linear-to-r ${getStatusColor(plot.status)}`}>
                      {plot.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-1">Plot #{plot.plotNumber}</h2>
                  <p className="text-gray-500 text-sm mb-4">Farmer: {plot?.farmer?.name || "N/A"}</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm font-medium">Size</span>
                      <span className="text-gray-800 font-semibold">{plot.size}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm font-medium">Price</span>
                      <span className="text-emerald-600 font-bold text-lg">₹{plot.price?.toLocaleString()}</span>
                    </div>
                    {plot.currentCrop && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm font-medium">Current Crop</span>
                        <span className="text-gray-800 font-semibold">{plot.currentCrop}</span>
                      </div>
                    )}
                  </div>

                  <button className="w-full bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 rounded-lg transition-all">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlotList;