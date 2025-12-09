import React from 'react';
import { MapPin, Star, ExternalLink, Briefcase } from 'lucide-react';

const NearbyTalent = ({ data }) => {
    if (!data || !data.categories || data.categories.length === 0) {
        return null;
    }

    return (
        <div className="w-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                    <Briefcase className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white">Nearby Service Ecosystem</h3>
                    <p className="text-secondary/60 text-sm">Local providers that can help you set up</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.categories.map((cat, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-5 backdrop-blur-sm hover:border-white/10 transition-colors">
                        <h4 className="text-lg font-bold text-white mb-4 border-b border-white/5 pb-2">{cat.label}</h4>
                        <div className="space-y-3">
                            {cat.places.map((place, pIdx) => (
                                <div key={pIdx} className="flex justify-between items-start group">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-slate-200 text-sm group-hover:text-blue-400 transition-colors line-clamp-1">{place.name}</span>
                                            {place.rating !== "N/A" && (
                                                <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded">
                                                    ★ {place.rating}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-secondary/40 line-clamp-1">{place.vicinity}</p>
                                    </div>
                                    <a
                                        href={place.mapUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-lg bg-white/5 hover:bg-blue-500 hover:text-white text-secondary transition-all"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-[10px] text-secondary/30 italic text-center">
                    Listed service providers are discovered via public map data. Starto does not verify, endorse, or guarantee the quality of any specific provider.
                </p>
            </div>
        </div>
    );
};

export default NearbyTalent;
