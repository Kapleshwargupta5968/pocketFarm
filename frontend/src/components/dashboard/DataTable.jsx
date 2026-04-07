import {Table} from "antd"
import { motion } from "framer-motion"

const DataTable = ({columns, data, title="My Plots Overview"}) => {
    return (
        <motion.div layout className="card shadow-sm border-slate-200/60 p-0 overflow-hidden bg-white/80 backdrop-blur-md rounded-2xl">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-linear-to-r from-emerald-50/50 to-transparent">
                <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
                <span className="text-xs font-medium px-3 py-1 bg-emerald-100/50 text-emerald-700 rounded-full border border-emerald-200/50">Recent Activities</span>
            </div>
            <Table
             columns={columns}
             dataSource={data}
             pagination={{pageSize: 5, className: 'px-6 py-4'}}
             className="w-full"
             rowKey="plotId"
             />
        </motion.div>
    );
}

export default DataTable;
