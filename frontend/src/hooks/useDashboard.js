import { useEffect, useCallback} from "react";
import { getDashboardStats, getDashboardTable, getEarningData } from "../services/dashboardService";

const useDashboard = () => {
    const [stats, setStats] = useState({});
    const [charts,setCharts] = useState([]);
    const [table, setTable] = useState([]);
    const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
    const fetchDashboardData = useCallback(async () => {
        try{
            setLoading(true);
            const [statsResponse, chartsResponse, tableResponse] = await Promise.all([
             getDashboardStats(),
             getEarningData(),
             getDashboardTable()
            ]);

            setStats(statsResponse);
            setCharts(chartsResponse);
            setTable(tableResponse);
        }catch(error){
        setError(`Error fetching dashboard data: ${error.message}`);
        }finally{
            setLoading(false);
        }
    }, []);

    useEffect(()=>{
        fetchDashboardData();
    }, [fetchDashboardData]);


  return { stats,
     charts,
      table,
       loading,
        error,
     refetch: fetchDashboardData
    };
}

export default useDashboard;
