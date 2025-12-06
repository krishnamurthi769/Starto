import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Loader2, BarChart3, Settings, Home as HomeIcon, LogOut, TrendingUp, Users, ArrowDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import MapComponent from '../components/MapComponent';
import ScoreCard from '../components/ScoreCard';
import AIInsightBox from '../components/AIInsightBox';
import FreelancerList from '../components/FreelancerList';
import WorkspaceList from '../components/WorkspaceList';
import InvestorGuidance from '../components/InvestorGuidance';
import { analyzeLocation, getCategories } from '../services/api';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
    const navigate = useNavigate();
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedLocationName, setSelectedLocationName] = useState('Selected Location');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedContext, setSelectedContext] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    // Ref for scrolling to results
    const resultsRef = useRef(null);

    const contextOptions = [
        "Solo / Bootstrap (Low Budget)",
        "Small Team / Seed (Medium Budget)",
        "High Growth / Venture (High Budget)",
        "Physical Retail / Franchise",
        "Digital / Remote First"
    ];

    useEffect(() => {
        const loadInitData = async () => {
            try {
                const cats = await getCategories();
                setCategories(cats);
            } catch (error) {
                console.error("Failed to load init data", error);
            }
        };
        loadInitData();
    }, []);

    // Reverse Geocoding Effect
    useEffect(() => {
        if (!selectedLocation) return;

        const fetchLocationName = async () => {
            try {
                const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
                if (!apiKey) {
                    setSelectedLocationName("Lat: " + selectedLocation.lat.toFixed(2));
                    return;
                }

                const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${selectedLocation.lat},${selectedLocation.lng}&key=${apiKey}`);
                const data = await response.json();

                if (data.results && data.results[0]) {
                    const addressComponents = data.results[0].address_components;
                    let city = null;
                    let locality = null;

                    for (let comp of addressComponents) {
                        if (comp.types.includes("locality")) city = comp.long_name;
                        if (comp.types.includes("sublocality")) locality = comp.long_name;
                    }

                    setSelectedLocationName(locality ? `${locality}, ${city}` : (city || "Selected Area"));
                }
            } catch (error) {
                console.error("Geocoding failed", error);
                setSelectedLocationName("Custom Location");
            }
        };
        fetchLocationName();
    }, [selectedLocation]);

    const handleAnalyze = async () => {
        if (!selectedLocation || !selectedCategory) return;

        setLoading(true);
        try {
            const result = await analyzeLocation(
                selectedLocation.lat,
                selectedLocation.lng,
                selectedCategory,
                selectedContext,
                selectedLocationName
            );
            console.log("Analysis Result:", result);
            setData(result);

            // Scroll to results after a slight delay for smooth transition
            setTimeout(() => {
                resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 500);

        } catch (error) {
            console.error("Analysis failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-primary relative selection:bg-amber-500/30 selection:text-amber-100 font-sans overflow-x-hidden">

            {/* Sidebar */}
            <Sidebar />

            <main className="relative z-10 w-full">
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-auto max-w-5xl mx-auto drop-shadow-2xl">
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 p-2 rounded-2xl flex items-center gap-2 ring-1 ring-white/5"
                    >
                        {/* 1. Category */}
                        <div className="group relative flex flex-col px-5 py-2 hover:bg-white/5 rounded-xl transition-colors cursor-pointer min-w-[200px]">
                            <span className="text-[10px] uppercase font-bold text-secondary/60 tracking-widest mb-1 group-hover:text-blue-400 transition-colors">01. Industry</span>
                            <div className="relative">
                                <select
                                    className="appearance-none bg-transparent border-none text-sm font-bold text-white focus:ring-0 cursor-pointer p-0 w-full pr-4"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="" className="bg-[#0a0a0a] text-secondary">Select Industry</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.name} className="bg-[#0a0a0a] text-white">{c.name}</option>
                                    ))}
                                </select>
                                <Sparkles className="w-3 h-3 text-secondary absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>

                        <div className="w-px h-10 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

                        {/* 2. Context */}
                        <div className="group relative flex flex-col px-5 py-2 hover:bg-white/5 rounded-xl transition-colors cursor-pointer min-w-[220px]">
                            <span className="text-[10px] uppercase font-bold text-secondary/60 tracking-widest mb-1 group-hover:text-purple-400 transition-colors">02. Scale (Optional)</span>
                            <select
                                className="appearance-none bg-transparent border-none text-sm font-bold text-white focus:ring-0 cursor-pointer p-0 w-full"
                                value={selectedContext}
                                onChange={(e) => setSelectedContext(e.target.value)}
                            >
                                <option value="" className="bg-[#0a0a0a] text-secondary">Default Scale</option>
                                {contextOptions.map((opt, idx) => (
                                    <option key={idx} value={opt} className="bg-[#0a0a0a] text-white">{opt}</option>
                                ))}
                            </select>
                        </div>

                        <div className="w-px h-10 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

                        {/* 3. Location Status */}
                        <div className={`flex flex-col px-5 py-2 rounded-xl transition-colors min-w-[180px] ${selectedLocation ? 'bg-emerald-950/30' : 'hover:bg-white/5'}`}>
                            <span className="text-[10px] uppercase font-bold text-secondary/60 tracking-widest mb-1">03. Target Zone</span>
                            <div className="flex items-center gap-2">
                                <MapPin className={`w-4 h-4 ${selectedLocation ? 'text-emerald-400' : 'text-secondary'}`} />
                                <span className={`text-sm font-bold ${selectedLocation ? 'text-emerald-100' : 'text-secondary/50'}`}>
                                    {selectedLocation ? "Location Locked" : "Drop Pin on Map"}
                                </span>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={handleAnalyze}
                            disabled={!selectedLocation || !selectedCategory || loading}
                            className="ml-4 bg-white hover:bg-slate-200 text-black px-8 py-3.5 rounded-xl text-sm font-bold shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <div className="relative"><Sparkles className="w-4 h-4 animate-pulse text-black" /></div>}
                            <span>Run Analysis</span>
                        </button>
                    </motion.div>
                </div>

                {/* HERO MAP SECTION */}
                <section className="relative w-full h-[75vh] border-b border-white/10">
                    <div className="w-full h-full grayscale-[0.2] invert-0">
                        <MapComponent
                            onLocationSelect={setSelectedLocation}
                            selectedLocation={selectedLocation}
                        />
                    </div>

                    {/* Hero Overlay Gradient */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />

                    {/* Prompt Text if no location */}
                    {!selectedLocation && !loading && (
                        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 pointer-events-none text-center">
                            <p className="text-secondary/70 text-sm uppercase tracking-widest mb-2 animate-bounce">Start Here</p>
                            <h2 className="text-3xl font-display font-bold text-white drop-shadow-xl">Drop a pin on the map to begin</h2>
                        </div>
                    )}
                </section>

                {/* RESULTS SECTION (Scrolls into view) */}
                <div ref={resultsRef} className="relative z-20 min-h-screen bg-[#050505] -mt-12 rounded-t-[3rem] border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] overflow-hidden">

                    {/* Texture Overlay */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-6 py-12">
                        <AnimatePresence mode="wait">
                            {data ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 100 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="space-y-16"
                                >
                                    {/* 1. Executive Summary Header */}
                                    <div className="text-center space-y-4 mb-16">
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
                                            Feasibility Report Generated
                                        </div>
                                        <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
                                            {selectedCategory} <span className="text-secondary font-light">in</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{selectedLocationName}</span>
                                        </h2>
                                        <p className="text-xl text-secondary max-w-2xl mx-auto">
                                            AI-driven analysis suggests a <strong className="text-white">{data.demand_score > 70 ? "High" : "Moderate"} Demand</strong> opportunity with {data.competition_score > 70 ? "significant" : "manageable"} competition.
                                        </p>
                                    </div>

                                    {/* 2. Key Metrics Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <ScoreCard
                                            demand={data.demand_score}
                                            competition={data.competition_score}
                                            risk={data.risk_level}
                                            breakdown={data.breakdown}
                                        />
                                        <AIInsightBox insight={data.ai_insight} />
                                    </div>

                                    {/* 3. Deep Dive Sections */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                        {/* Left Col: Competitors */}
                                        <div className="space-y-8">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400"><Users className="w-6 h-6" /></div>
                                                <h3 className="text-2xl font-bold text-white">Market Landscape</h3>
                                            </div>

                                            {data.competitors && (
                                                <div className="p-8 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm">
                                                    <div className="h-64 w-full mb-8">
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <BarChart data={data.competitors} layout="vertical">
                                                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                                                                <XAxis type="number" stroke="#94a3b8" />
                                                                <YAxis dataKey="name" type="category" width={100} stroke="#94a3b8" tick={{ fontSize: 12, fill: '#cbd5e1' }} />
                                                                <Tooltip
                                                                    cursor={{ fill: 'transparent' }}
                                                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                                                                />
                                                                <Bar dataKey="market_share" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={20}>
                                                                    {data.competitors.map((entry, index) => (
                                                                        <cell key={`cell-${index}`} fill={index === 0 ? '#f59e0b' : '#ffffff20'} />
                                                                    ))}
                                                                </Bar>
                                                            </BarChart>
                                                        </ResponsiveContainer>
                                                    </div>
                                                    <div className="space-y-3">
                                                        {data.competitors.map((comp, idx) => (
                                                            <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5">
                                                                <span className="font-bold text-white text-sm">{comp.name}</span>
                                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${comp.strength === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                                                    {comp.strength} Threat
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Right Col: Execution */}
                                        <div className="space-y-8">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400"><Sparkles className="w-6 h-6" /></div>
                                                <h3 className="text-2xl font-bold text-white">Execution Resources</h3>
                                            </div>

                                            <div className="space-y-6">
                                                <FreelancerList
                                                    freelancers={data.relevant_freelancers}
                                                    userLocation={selectedLocation}
                                                    category={selectedCategory}
                                                />
                                                <WorkspaceList workspaces={data.relevant_workspaces} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 4. Investor Guidance (Full Width) */}
                                    <div className="pt-12 border-t border-white/10">
                                        <InvestorGuidance guidance={data.investor_guidance} />
                                    </div>

                                </motion.div>
                            ) : (
                                <div className="min-h-[40vh] flex flex-col items-center justify-center text-secondary/40 text-center">
                                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                        <ArrowDown className="w-8 h-8 opacity-50 animate-bounce" />
                                    </div>
                                    <p className="text-lg">Results will appear here after analysis</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default Dashboard;
