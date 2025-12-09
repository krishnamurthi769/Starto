import React from 'react';
import { Landmark, ArrowRight, Wallet2, GraduationCap } from 'lucide-react';

const FundingGuidance = ({ data }) => {
    if (!data) return null;

    return (
        <div className="w-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400">
                    <Landmark className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white">Funding Guidance</h3>
                    <p className="text-secondary/60 text-sm">Recommended financial pathways for {data.stage || "this stage"}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.paths && data.paths.map((path, idx) => (
                    <div key={idx} className="group relative p-6 rounded-2xl bg-gradient-to-b from-white/10 to-black border border-white/10 hover:border-amber-500/30 transition-all hover:translate-y-[-2px]">
                        <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />

                        <div className="relative z-10">
                            <h4 className="text-lg font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">{path.title}</h4>
                            <p className="text-sm text-secondary/70 leading-relaxed mb-4">
                                {path.body}
                            </p>
                            {/* Generic Learn More - could link to specific resources per path later */}
                            <div className="flex items-center text-xs font-bold text-secondary/40 uppercase tracking-wider group-hover:text-white transition-colors">
                                Learn More <ArrowRight className="w-3 h-3 ml-1" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-4 border-t border-white/5">
                <p className="text-[10px] text-secondary/30 italic text-center">
                    Funding guidance is informational and based on common patterns. It is not financial or legal advice.
                </p>
            </div>
        </div>
    );
};

export default FundingGuidance;
