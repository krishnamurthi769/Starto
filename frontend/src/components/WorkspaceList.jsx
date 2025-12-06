import React from 'react';
import { Building2, MapPin } from 'lucide-react';

const WorkspaceList = ({ workspaces }) => {
    if (!workspaces || workspaces.length === 0) {
        return (
            <div className="glass-card rounded-xl overflow-hidden p-6 text-center">
                <p className="text-secondary text-sm">No suitable spaces found nearby.</p>
            </div>
        );
    }

    return (
        <div className="glass-card rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-purple-400" />
                    Available Spaces
                </h3>
                <span className="text-xs text-secondary bg-white/5 px-2 py-1 rounded-full">
                    {workspaces.length} Found
                </span>
            </div>
            <div className="divide-y divide-white/5">
                {workspaces.map((w) => (
                    <div key={w.id} className="p-4 hover:bg-white/5 transition-colors group cursor-pointer">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-medium text-white group-hover:text-blue-400 transition-colors">{w.name}</h4>
                                <p className="text-sm text-secondary">{w.type}</p>
                            </div>
                            <div className="text-right">
                                <span className="block font-bold text-white">{w.rent}</span>
                                <span className="text-xs text-secondary">{w.area_sqft} sq.ft</span>
                            </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                                <MapPin className="w-3 h-3" />
                                Nearby
                            </span>
                            <button className="text-xs text-blue-400 hover:text-blue-300 font-medium border border-blue-400/20 px-2 py-1 rounded hover:bg-blue-400/10 transition-all">
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkspaceList;
