import StatsCard from "../../components/dashboard/StatsCard"
import EarningsChart from "../../components/dashboard/EarningsChart"
import DataTable from "../../components/dashboard/DataTable";
import Loader from "../../components/common/Loader"
import { fetchDashboardData } from "../../features/dashboard/dashboardThunk";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { 
  Sprout, 
  CreditCard, 
  WalletCards, 
  BellRing,
  CheckCircle2,
  Clock,
  Ban
} from "lucide-react";

const FarmerDashboard = () => {
  const dispatch = useDispatch();
  const { stats, chart, table, loading, error } = useSelector(state => state.dashboard);

  useEffect(()=>{
    if(!stats?.totalPlots){
      dispatch(fetchDashboardData());
    }
  },[dispatch, stats]);

  if (loading) return <div className="h-full w-full flex items-center justify-center p-12"><Loader fullScreen={false} text="Preparing your premium dashboard..." /></div>
  if (error) return <div className="p-8 text-center bg-red-50 text-red-600 rounded-xl m-8">Error: {error}</div>

  const columns = [
    {
      title: "Plot ID",
      dataIndex: "plotId",
      key: "plotId",
      render: (val) => <span className="font-medium text-slate-700">{val}</span>
    },
    {
      title: "Plot Name",
      dataIndex: "name",
      key: "name",
      render: (val) => <span className="font-semibold text-slate-800">{val}</span>
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const isReady = status?.toLowerCase() === 'ready';
        const isPending = status?.toLowerCase() === 'pending';
        return (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
            ${isReady ? 'bg-emerald-100 text-emerald-700' : 
              isPending ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
            {isReady && <CheckCircle2 size={14} />}
            {isPending && <Clock size={14} />}
            {!isReady && !isPending && <Ban size={14} />}
            {status}
          </span>
        )
      }
    },
    {
      title: "Subscription",
      dataIndex: "subscription",
      key: "subscription",
      render: (sub) => sub ? <span className="text-slate-600">{sub}</span> : <span className="text-slate-400 italic">None</span>
    },
    {
      title: "Price (INR)",
      dataIndex: "price",
      key: "price",
      render: (val) => <span className="font-medium text-slate-700">₹{parseFloat(val).toLocaleString()}</span>
    },
    {
      title: "Earnings (INR)",
      dataIndex: "earnings",
      key: "earnings",
      render: (val) => <span className="font-bold text-emerald-600">₹{parseFloat(val).toLocaleString()}</span>
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-fade-in-up">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 delay-100">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            Farmer Dashboard
          </h1>
          <p className="text-slate-500 mt-1">Here is what's happening with your farm today.</p>
        </div>
        <div className="flex items-center gap-3">
            <button className="btn-secondary flex items-center gap-2">
               Download Report
            </button>
            <button className="btn-primary flex items-center gap-2">
               + Create New Plot
            </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 delay-200">
        <StatsCard 
          icon={Sprout} 
          title="Total Plots" 
          value={stats?.totalPlots || "0"} 
        />
        <StatsCard 
          icon={CreditCard} 
          title="Active Subscriptions" 
          value={stats?.activeSubscriptions || "0"} 
        />
        <StatsCard 
          icon={WalletCards} 
          title="Earnings (INR)" 
          value={`₹${stats?.earnings || "0"}`} 
        />
        <StatsCard 
          icon={BellRing} 
          title="Pending Requests" 
          value={stats?.pendingRequests || "0"} 
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 delay-300">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <EarningsChart data={chart || []} />
          
          <div className="animate-fade-in-up delay-300">
            <DataTable columns={columns} data={table || []} />
          </div>
        </div>

        {/* Side Panel or Promotions */}
        <div className="lg:col-span-1 space-y-6">
          {/* We can place additional premium widgets here later. For now, an elevated quick-actions card. */}
          <div className="card bg-gradient-to-br from-emerald-600 to-teal-800 text-white border-0">
             <div className="mb-4 text-emerald-100">
               <Sprout size={32} />
             </div>
             <h3 className="text-xl font-bold mb-2">Grow your revenue</h3>
             <p className="text-emerald-100/80 text-sm mb-6">List more plots and attract premium subscribers from our network.</p>
             <button className="bg-white text-teal-800 font-semibold px-4 py-2 rounded-xl text-sm hover:scale-105 active:scale-95 transition-transform w-full shadow-lg">
                Explore Marketplaces
             </button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default FarmerDashboard;