import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, BarChart3, ShieldAlert, CheckCircle2 } from 'lucide-react';
import logo from '../assets/logo.png';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-blue-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full opacity-40 mix-blend-screen" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/5 blur-[120px] rounded-full opacity-30 mix-blend-screen" />
            </div>

            {/* Navbar */}
            <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <img src={logo} alt="Starto" className="h-10 w-auto" />
                    {/* Optional: Add text if logo is icon only */}
                    {/* <span className="font-bold text-xl tracking-tight">Starto</span> */}
                </div>
                <div className="flex items-center gap-4">
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20 uppercase tracking-wider">
                        Beta
                    </span>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-5 py-2.5 bg-white text-black rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors"
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 pt-20 pb-32 px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-sm text-slate-300 font-medium">New: Advanced Competitor Tracking</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
                        AI-Powered Business <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Location Intelligence</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Don't guess where to open your business. Make data-driven decisions based on real competitor density, market demand, and AI risk analysis.
                        <br /><span className="text-slate-500 text-sm mt-2 block italic">"Make data-driven decisions before investing lakhs."</span>
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2"
                        >
                            Analyze My Location <ArrowRight className="w-5 h-5" />
                        </button>
                        <button className="w-full md:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-medium text-lg transition-all backdrop-blur-sm">
                            View Sample Report
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* How It Works */}
            <section className="relative z-10 py-24 bg-[#080808] border-y border-white/5">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">How It Works</h2>
                        <p className="text-slate-400">Three simple steps to validate your business idea.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: MapPin,
                                title: "1. Select Location",
                                desc: "Pinpoint your exact potential store location on our interactive map."
                            },
                            {
                                icon: BarChart3,
                                title: "2. AI Analysis",
                                desc: "Our engine scans real competitors, calculates saturation, and predicts demand."
                            },
                            {
                                icon: ShieldAlert,
                                title: "3. Get Risk Report",
                                desc: "Receive a comprehensive feasibility score and go/no-go recommendation."
                            }
                        ].map((step, i) => (
                            <div key={i} className="relative group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all">
                                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                                        <step.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sample Insights Preview */}
            <section className="relative z-10 py-24 px-4 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                                Professional Insights that <br />
                                <span className="text-blue-400">Investors Trust</span>.
                            </h2>
                            <p className="text-slate-400 text-lg">
                                Stop relying on gut feeling. Get detailed breakdowns of competitor strength, market gaps, and detailed risk calculations.
                            </p>
                            <ul className="space-y-4">
                                {["Real-time Competitor Data", "Saturation Risk Score (0-100)", "Actionable AI Consultant Advice"].map(item => (
                                    <li key={item} className="flex items-center gap-3 text-slate-300">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Mock UI Card */}
                        <div className="flex-1 w-full max-w-md md:max-w-full">
                            <div className="relative rounded-2xl bg-[#0f1115] border border-white/10 p-6 shadow-2xl skew-y-1 transform transition-transform hover:skew-y-0 duration-500">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                                    <div>
                                        <div className="text-sm text-slate-400 uppercase tracking-widest mb-1">Risk Assessment</div>
                                        <div className="text-2xl font-bold text-white">Cafe • Indiranagar</div>
                                    </div>
                                    <div className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg font-bold">
                                        High Risk (72/100)
                                    </div>
                                </div>

                                {/* Metrics */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                        <div className="text-slate-400 text-sm mb-1">Competitors</div>
                                        <div className="text-2xl font-bold text-white">12 <span className="text-xs font-normal text-slate-500">within 1.5km</span></div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                        <div className="text-slate-400 text-sm mb-1">Avg Rating</div>
                                        <div className="text-2xl font-bold text-yellow-400">4.5 <span className="text-xs font-normal text-slate-500 text-white">/ 5.0</span></div>
                                    </div>
                                </div>

                                {/* AI Text */}
                                <div className="p-4 rounded-xl bg-blue-900/10 border border-blue-500/10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                                        <span className="text-xs font-bold text-blue-400 uppercase">AI Analyst</span>
                                    </div>
                                    <p className="text-sm text-slate-300 leading-relaxed">
                                        "Market is heavily saturated with high-rated incumbents. Entry is not recommended unless you have a unique differentiator or higher capital for marketing."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Disclaimer & Footer */}
            <footer className="py-12 border-t border-white/5 text-center px-4 relative z-10">
                <p className="text-slate-500 text-sm mb-4 max-w-2xl mx-auto">
                    Disclaimer: Starto is a decision-support tool. All insights are estimates based on available data. We do not guarantee business success or financial outcomes.
                </p>
                <div className="flex items-center justify-center gap-6 text-slate-400 text-sm">
                    <span>© 2025 Starto Intelligence</span>
                    <a href="#" className="hover:text-white">Privacy</a>
                    <a href="#" className="hover:text-white">Terms</a>
                </div>
            </footer>
        </div>
    );
};

export default Home;
