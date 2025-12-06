import React from 'react';
import { TrendingUp, AlertTriangle, Users, Activity, BarChart4 } from 'lucide-react';
import { motion } from 'framer-motion';

const RadialProgress = ({ score, color, label, icon: Icon }) => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center p-6 glass-card rounded-2xl relative overflow-hidden group hover:bg-white/5 transition-colors border border-white/5">
            {/* Background Glow */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${color}`} />

            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-white/5"
                    />
                    {/* Foreground Circle - Animated */}
                    <motion.circle
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        cx="64"
                        cy="64"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeLinecap="round"
                        className={color.replace('bg-', 'text-').split(' ')[0]} // Extract text color class
                    />
                </svg>
                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white tracking-tighter">{score}</span>
                    <span className="text-[10px] uppercase text-secondary font-bold">Score</span>
                </div>
            </div>

            <div className="text-center z-10">
                <div className="flex items-center justify-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${color.replace('bg-', 'text-').split(' ')[0]}`} />
                    <h3 className="font-bold text-white text-sm uppercase tracking-wide">{label}</h3>
                </div>
                <p className="text-xs text-secondary/60 max-w-[120px] mx-auto leading-relaxed">
                    Weighted analysis of local signals
                </p>
            </div>
        </div>
    );
};

const RiskGauge = ({ risk }) => {
    const levels = ['Low', 'Medium', 'High'];
    const activeIndex = levels.indexOf(risk);
    const colors = ['bg-emerald-500', 'bg-amber-500', 'bg-red-500'];
    const activeColor = colors[activeIndex] || 'bg-slate-500';

    return (
        <div className="flex flex-col items-center justify-center p-6 glass-card rounded-2xl border border-white/5 relative overflow-hidden h-full">
            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="mb-6 relative">
                <AlertTriangle className={`w-12 h-12 ${activeColor.replace('bg-', 'text-')} opacity-80`} />
                <div className={`absolute inset-0 ${activeColor} blur-xl opacity-20`} />
            </div>

            <div className="text-center z-10 mb-6">
                <h3 className="font-bold text-white text-lg mb-1">Risk Assessment</h3>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${activeColor.replace('bg-', 'border-').replace('500', '500/30')} ${activeColor.replace('bg-', 'bg-').replace('500', '500/10')}`}>
                    <span className={`w-2 h-2 rounded-full ${activeColor}`} />
                    <span className={`text-xs font-bold uppercase tracking-wider ${activeColor.replace('bg-', 'text-')}`}>
                        {risk} Risk
                    </span>
                </div>
            </div>

            {/* Step Gauge */}
            <div className="flex items-center gap-1 w-full max-w-[140px] opacity-80">
                {levels.map((l, i) => (
                    <div
                        key={l}
                        className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${i <= activeIndex ? colors[i] : 'bg-white/10'}`}
                    />
                ))}
            </div>
        </div>
    );
};

const ScoreCard = ({ demand, competition, risk, breakdown }) => {
    return (
        <div className="col-span-2 space-y-4">
            {/* Main Scores Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <RadialProgress
                    score={demand}
                    label="Market Demand"
                    color="text-blue-500 from-blue-500/20"
                    icon={TrendingUp}
                />
                <RadialProgress
                    score={competition}
                    label="Competition"
                    color="text-purple-500 from-purple-500/20"
                    icon={Users}
                />
                <RiskGauge risk={risk} />
            </div>

            {/* Breakdown Pill Grid */}
            {breakdown && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    {breakdown.map((item, index) => (
                        <div key={index} className="bg-white/5 border border-white/5 px-4 py-3 rounded-xl flex items-center justify-between">
                            <span className="text-xs font-medium text-secondary uppercase tracking-wider">{item.label}</span>
                            <span className="font-mono text-sm font-bold text-white">{item.value}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ScoreCard;
