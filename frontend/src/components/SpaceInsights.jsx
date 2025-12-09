import React from 'react';
import { Building2, TrendingUp, Wallet, MapPin, ExternalLink } from 'lucide-react';

const SpaceInsights = ({ data }) => {
    if (!data) return null;

    return (
        <div className="w-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                    <Building2 className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white">Space Availability Insights</h3>
                    <p className="text-secondary/60 text-sm">Area profile and rental expectations</p>
                </div>
            </div>

            {/* High Level Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-2 opacity-60">
                        <MapPin className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-secondary">Area Typology</span>
                    </div>
                    <div className="text-xl font-bold text-white">{data.areaType || "Unknown"}</div>
                </div>

                <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-2 opacity-60">
                        <Wallet className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-secondary">Estimated Rent</span>
                    </div>
                    <div className="text-xl font-bold text-white">{data.rentLevel || "Medium"} <span className="text-sm font-normal text-secondary/50">Level</span></div>
                </div>
            </div>

            {/* AI Comment */}
            {data.aiComment && (
                <div className="mb-8 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-sm text-blue-200/80">
                    "{data.aiComment}"
                </div>
            )}

            {/* Coworking List */}
            {data.coWorkingSpaces && data.coWorkingSpaces.length > 0 && (
                <div>
                    <h4 className="text-sm font-bold text-secondary uppercase tracking-widest mb-4">Nearby Co-working & Commercial Complexes</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.coWorkingSpaces.map((space, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group">
                                <div>
                                    <div className="font-bold text-white text-sm mb-1">{space.name}</div>
                                    <div className="text-xs text-secondary/50 line-clamp-1">{space.vicinity}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {space.rating !== "N/A" && (
                                        <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">
                                            {space.rating}
                                        </span>
                                    )}
                                    <a href={space.mapUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-black text-secondary hover:text-white transition-colors">
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-6 pt-4 border-t border-white/5">
                <p className="text-[10px] text-secondary/30 italic text-center">
                    Space insights are indicative based on area characteristics. Consult local brokers for exact vacancies.
                </p>
            </div>
        </div>
    );
};

export default SpaceInsights;
