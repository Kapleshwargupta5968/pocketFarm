import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <p className="text-slate-500 font-medium text-xs mb-1">{label}</p>
        <p className="text-emerald-600 font-bold text-lg">
          ₹{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const EarningsChart = React.memo(({ data }) => {
    return (
        <div className="card h-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-800">Earnings Overview</h2>
                <span className="text-xs font-medium px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">Monthly</span>
            </div>
       
            <div className="w-full h-75">
                <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis 
                            dataKey="month" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#64748b', fontSize: 12}} 
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#64748b', fontSize: 12}} 
                            tickFormatter={(value) => `₹${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area 
                            type="monotone" 
                            dataKey="totalEarnings" 
                            stroke="#10b981" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorEarnings)" 
                            activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 3 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
});

export default EarningsChart;