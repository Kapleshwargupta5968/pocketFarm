import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyPlots, deletePlot } from "../../services/plotService";
import { setMyPlots } from "../../features/plot/plotSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const STATUS_CONFIG = {
  Available: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  Subscribed: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
  Harvesting: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  Inactive: { bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-400" },
};

const StatCard = ({ label, value, gradient, icon }) => (
  <div className={`relative overflow-hidden rounded-2xl p-5 text-white ${gradient} shadow-lg`}>
    <div className="absolute -right-4 -top-4 text-white/10 text-8xl select-none">{icon}</div>
    <p className="text-sm font-medium text-white/80 uppercase tracking-wider">{label}</p>
    <p className="text-4xl font-bold mt-1">{value ?? 0}</p>
  </div>
);

const MyPlots = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { myPlots, stats } = useSelector((state) => state.plot);

  useEffect(() => {
    const fetchMyPlots = async () => {
      try {
        const response = await getMyPlots();
        dispatch(setMyPlots(response));
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to fetch plots");
      }
    };
    fetchMyPlots();
  }, [dispatch]);

  const handleDelete = async (plotID) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this plot?");
    if (!confirmDelete) return;
    try {
      await deletePlot(plotID);
      const updatePlots = myPlots.filter((plot) => plot._id !== plotID);
      const updateStats = {
        total: updatePlots.length,
        available: updatePlots.filter((p) => p.status === "Available").length,
        subscribed: updatePlots.filter((p) => p.status === "Subscribed").length,
        harvesting: updatePlots.filter((p) => p.status === "Harvesting").length,
      };
      dispatch(setMyPlots({ plots: updatePlots, stats: updateStats }));
      toast.success("Plot deleted successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete plot");
    }
  };

  return (
    <div className="pb-10">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">My Plots</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Manage and monitor all your farm plots</p>
        </div>
        <button
          onClick={() => navigate("/dashboard/create-plot")}
          className="btn-primary flex items-center gap-2"
        >
          <span className="text-xl leading-none">＋</span>
          Create Plot
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total" value={stats?.total} gradient="bg-gradient-to-br from-green-500 to-green-700" icon="🌱" />
        <StatCard label="Available" value={stats?.available} gradient="bg-gradient-to-br from-emerald-400 to-teal-600" icon="✅" />
        <StatCard label="Subscribed" value={stats?.subscribed} gradient="bg-gradient-to-br from-blue-400 to-blue-700" icon="📋" />
        <StatCard label="Harvesting" value={stats?.harvesting} gradient="bg-gradient-to-br from-amber-400 to-orange-600" icon="🌾" />
      </div>

      {/* ── Plot Grid ── */}
      {myPlots?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-6xl mb-4">🌿</div>
          <h2 className="text-xl font-semibold text-gray-700">No plots yet</h2>
          <p className="text-gray-400 mt-1 mb-6">Create your first plot to start managing your farm</p>
          <button
            onClick={() => navigate("/dashboard/create-plot")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-xl transition"
          >
            + Create Plot
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {myPlots.map((plot) => {
            const statusStyle = STATUS_CONFIG[plot.status] || STATUS_CONFIG.Inactive;
            return (
              <div
                key={plot._id}
                className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden group border border-slate-100"
              >
                {/* Image Area */}
                <div className="relative h-44 bg-gradient-to-br from-green-50 to-emerald-100 overflow-hidden">
                  {plot.images && plot.images.length > 0 ? (
                    <>
                      <img
                        src={plot.images[0]}
                        alt={`Plot ${plot.plotNumber}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {plot.images.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm">
                          +{plot.images.length - 1} more
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-green-300">
                      <span className="text-5xl">🌾</span>
                      <p className="text-xs mt-2 text-green-400">No images uploaded</p>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text} shadow-sm`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                    {plot.status}
                  </div>

                  {/* Plot Number Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-2.5 py-1 rounded-full shadow">
                    #{plot.plotNumber}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-800 mb-1 tracking-tight">
                    Plot #{plot.plotNumber}
                  </h3>

                  {plot.currentCrop && (
                    <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full mb-3">
                      🌱 {plot.currentCrop}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <InfoItem icon="📐" label="Size" value={`${plot.size} sq.ft`} />
                    <InfoItem icon="💰" label="Price" value={`₹${Number(plot.price).toLocaleString()}`} />
                    {plot.sowingDate && (
                      <InfoItem icon="🗓️" label="Sown" value={new Date(plot.sowingDate).toLocaleDateString()} />
                    )}
                    {plot.expectedHarvestDate && (
                      <InfoItem icon="🌾" label="Harvest" value={new Date(plot.expectedHarvestDate).toLocaleDateString()} />
                    )}
                  </div>

                  {plot.location?.coordinates && (
                    <p className="text-xs text-gray-400 flex items-center gap-1 mb-4">
                      📍{" "}
                      {plot.location.coordinates[1].toFixed(4)},{" "}
                      {plot.location.coordinates[0].toFixed(4)}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-slate-100 mt-2">
                    <button
                      onClick={() => navigate(`/dashboard/plots/${plot._id}`)}
                      className="flex-1 text-sm font-semibold text-emerald-700 bg-emerald-50/50 border border-emerald-100 hover:bg-emerald-50 hover:border-emerald-200 py-2 rounded-xl transition-all duration-200"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/dashboard/edit-plot/${plot._id}`)}
                      className="flex-1 text-sm font-semibold text-blue-700 bg-blue-50/50 border border-blue-100 hover:bg-blue-50 hover:border-blue-200 py-2 rounded-xl transition-all duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(plot._id)}
                      className="flex-1 text-sm font-semibold text-red-600 bg-red-50/50 border border-red-100 hover:bg-red-50 hover:border-red-200 py-2 rounded-xl transition-all duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-1.5">
    <span className="text-sm leading-tight">{icon}</span>
    <div>
      <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">{label}</p>
      <p className="text-sm font-semibold text-gray-700 leading-tight">{value}</p>
    </div>
  </div>
);

export default MyPlots;
