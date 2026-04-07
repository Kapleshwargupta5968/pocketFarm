import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { Sprout, Activity, Wallet } from "lucide-react";
import Loader from "../../components/common/Loader";
import DataTable from "../../components/dashboard/DataTable";
import StatsCard from "../../components/dashboard/StatsCard";
import { fetchDashboardData } from "../../features/dashboard/dashboardThunk";
import { motion } from "framer-motion";

const SubscriberDashboard = () => {
  const dispatch = useDispatch();
  const { stats, table, loading, error } = useSelector(state => state.dashboard);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(fetchDashboardData());
    }
  }, [dispatch]);

  if (loading) return <Loader fullScreen text="Loading dashboard..." />
  if (error) return <div className="text-red-500">{error}</div>

  const columns = [
    { 
      title: "Plot ID", 
      dataIndex: "plotId", 
      key: "plotId",
      render: (val) => <span className="font-medium text-slate-700">{val?.toString().slice(-8)}</span>
    },
    { 
      title: "Crop", 
      dataIndex: "crop", 
      key: "crop",
      render: (val) => <span>{val || "N/A"}</span>
    },
    { 
      title: "Status", 
      dataIndex: "status", 
      key: "status",
      render: (val) => <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-sm font-medium">{val}</span>
    },
    { 
      title: "Price (INR)", 
      dataIndex: "price", 
      key: "price",
      render: (val) => <span className="font-medium text-slate-700">₹{val ? parseFloat(val).toLocaleString() : "0"}</span>
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 300, damping: 24 } 
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8 rounded-tr-3xl">
      <motion.div 
        className="max-w-7xl mx-auto space-y-8 mt-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-emerald-600">
              <Sprout size={20} className="animate-pulse" />
              <span className="text-sm font-bold tracking-wider uppercase">Overview</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
              Subscriber Dashboard
            </h1>
            <p className="text-slate-500 mt-2 text-lg">Manage your subscriptions and track your active plots effortlessly.</p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard 
            title="Subscribed Plots" 
            value={stats?.subscribedPlots ?? "0"} 
            icon={Sprout} 
          />
          <StatsCard 
            title="Active Plans" 
            value={stats?.activePlans ?? "0"} 
            icon={Activity} 
          />
          <StatsCard 
            title="Total Spent" 
            value={`₹${stats?.totalSpent ?? "0"}`} 
            icon={Wallet} 
          />
        </motion.div>

        {/* Data Table Section */}
        <motion.div variants={itemVariants} className="pt-4">
          <DataTable 
            title="My Subscriptions"
            columns={columns} 
            data={table || []} 
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default SubscriberDashboard;