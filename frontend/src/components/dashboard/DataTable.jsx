import {Table} from "antd"

const DataTable = ({columns, data}) => {
    return (
        <div className="card border-0 p-0 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/50">
                <h3 className="text-lg font-semibold text-slate-800">My Plots Overview</h3>
                <span className="text-xs font-medium px-3 py-1 bg-slate-100 text-slate-600 rounded-full">Recent</span>
            </div>
            <Table
             columns={columns}
             dataSource={data}
             pagination={{pageSize: 5, className: 'px-6'}}
             className="w-full"
             rowKey="plotId"
             />
        </div>
    );
}

export default DataTable;
