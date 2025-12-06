import React from 'react';
import { BadgeDollarSign, TrendingUp, Wallet, ArrowRight } from 'lucide-react';

const InvestorGuidance = ({ guidance }) => {
    if (!guidance) return null;

    return (
        <div className="glass-card p-6 rounded-xl border border-white/10 mt-8 mb-8">
            <h3 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
                <BadgeDollarSign className="w-5 h-5 text-emerald-400" />
                Funding & Investor Guidance
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Funding Path */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                            <Wallet className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-emerald-200/70 font-bold uppercase tracking-wider mb-1">Recommended Path</p>
                            <h4 className="text-lg font-bold text-white">{guidance.type}</h4>
                        </div>
                    </div>
                </div>

                {/* Strategic Advice */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-blue-200/70 font-bold uppercase tracking-wider mb-1">Strategy</p>
                            <p className="text-sm text-white/90 leading-relaxed">
                                "{guidance.advice}"
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <p className="text-xs text-secondary">
                    Based on capital intensity and growth patterns for this business type.
                </p>
                <button className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors">
                    Find Investors <ArrowRight className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
};

export default InvestorGuidance;
