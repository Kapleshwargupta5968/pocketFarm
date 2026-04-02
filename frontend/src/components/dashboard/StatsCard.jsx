import React from 'react';

const StatsCard = React.memo(({ title, value, icon: Icon }) => {
    return (
        <div className="card group hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden relative">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-emerald-100/50 to-teal-50/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"/>
            <div className="flex items-center gap-4 relative z-10">
                {Icon && (
                    <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl shadow-inner border border-emerald-100/50 text-emerald-600 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-emerald-500 group-hover:to-teal-600 group-hover:text-white transition-all duration-300">
                        <Icon size={24} strokeWidth={2} />
                    </div>
                )}
                <div>
                    <h3 className="text-slate-500 font-medium text-sm mb-1">{title}</h3>
                    <p className="text-slate-800 font-bold text-3xl tracking-tight">{value}</p>
                </div>
            </div>
        </div>
    );
});

export default StatsCard;