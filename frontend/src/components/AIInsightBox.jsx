import React from 'react';
import { Sparkles, Bot, Terminal } from 'lucide-react';

const AIInsightBox = ({ insight }) => {
    if (!insight) return null;

    return (
        <div className="relative group p-1 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-blue-500/20 shadow-2xl">
            {/* Inner Content */}
            <div className="bg-[#0f1014] rounded-xl p-8 h-full relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Bot className="w-24 h-24 text-white" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                        <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white tracking-wide">AI Feasibility Report</h3>
                            <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                PROCESSING COMPLETE
                            </div>
                        </div>
                    </div>

                    <div className="font-mono text-sm md:text-base text-indigo-100/90 leading-relaxed font-light">
                        <span className="text-secondary mr-2">{'>'}</span>
                        {insight}
                        <span className="inline-block w-2 h-4 bg-indigo-500 ml-1 animate-pulse align-middle"></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIInsightBox;
