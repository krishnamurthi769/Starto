import React from 'react';
import Sidebar from '../components/Sidebar';
import { BarChart3, TrendingUp, ArrowUpRight } from 'lucide-react';

const Analytics = () => {
    return (
        <div className="min-h-screen bg-[#050505] text-primary relative selection:bg-amber-500/30 selection:text-amber-100 font-sans overflow-x-hidden">
            {/* Global Background Texture */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/20 to-transparent" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px]" />
            </div>

            <Sidebar />

            <main className="relative z-10 w-full pl-0 xl:pl-32 pr-6 py-12">
                <div className="max-w-7xl mx-auto space-y-8">
                    <header className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 text-secondary">
                            <BarChart3 className="w-5 h-5" />
                            <span className="uppercase tracking-widest text-xs font-bold">Performance</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white">Analytics Overview</h1>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Placeholder Charts */}
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm min-h-[300px] flex flex-col justify-between group hover:bg-white/[0.07] transition-colors">
                                <div className="space-y-2">
                                    <h3 className="text-lg font-bold text-white">Market Trend {i}</h3>
                                    <p className="text-sm text-secondary">Comparative analysis of local demand.</p>
                                </div>
                                <div className="w-full flex-grow flex items-center justify-center relative">
                                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-blue-500/10 to-transparent" />
                                    <TrendingUp className="w-12 h-12 text-blue-500/50 group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                                    <ArrowUpRight className="w-4 h-4" />
                                    <span>+12.5% Growth</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-8 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm min-h-[400px] flex items-center justify-center">
                        <p className="text-secondary text-lg">Detailed reports and historical data visualization coming soon.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Analytics;
