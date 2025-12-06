import React, { useState, useEffect, useRef } from 'react';
import { Star, MapPin, UserCheck, AlertCircle, Info, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import { getFreelancers } from '../services/api';
import gsap from 'gsap';

const FreelancerList = ({ freelancers: initialFreelancers, userLocation, category }) => {
    const [freelancers, setFreelancers] = useState(initialFreelancers || []); // Handle initial data safely
    const [isFallback, setIsFallback] = useState(false);

    // Handle incoming prop updates safely
    useEffect(() => {
        if (initialFreelancers) {
            if (Array.isArray(initialFreelancers)) {
                setFreelancers(initialFreelancers);
                setIsFallback(false);
            } else {
                setFreelancers(initialFreelancers.freelancers || []);
                setIsFallback(initialFreelancers.is_fallback || false);
            }
        }
    }, [initialFreelancers]);

    const [radius, setRadius] = useState(25);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef(null);
    const cardsRef = useRef([]);

    // Independent fetch for radius changes
    const handleRadiusChange = async (newRadius) => {
        setRadius(newRadius);
        if (!userLocation) return;

        setLoading(true);

        // Animate out
        gsap.to(cardsRef.current, {
            opacity: 0,
            y: 10,
            stagger: 0.05,
            duration: 0.3,
            onComplete: async () => {
                try {
                    const results = await getFreelancers({
                        lat: userLocation.lat,
                        lng: userLocation.lng,
                        radius_km: newRadius,
                        category: category
                    });

                    // Handle API response format
                    if (results && !Array.isArray(results) && results.freelancers) {
                        setFreelancers(results.freelancers);
                        setIsFallback(results.is_fallback);
                    } else if (Array.isArray(results)) {
                        setFreelancers(results);
                        setIsFallback(false);
                    } else {
                        setFreelancers([]); // Safety fallback
                    }

                } catch (error) {
                    console.error("Failed to fetch freelancers:", error);
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    // Animate In when data updates or loading finishes
    useEffect(() => {
        if (!loading && freelancers.length > 0 && containerRef.current) {
            gsap.fromTo(cardsRef.current,
                { opacity: 0, y: 30, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.2)", clearProps: "all" }
            );
        }
    }, [freelancers, loading]);

    // Hover Effects
    const handleMouseEnter = (e) => {
        gsap.to(e.currentTarget, {
            scale: 1.02,
            boxShadow: "0 20px 30px -10px rgba(0,0,0,0.5), 0 0 15px rgba(59, 130, 246, 0.2)",
            borderColor: "rgba(96, 165, 250, 0.4)",
            duration: 0.3,
            ease: "power2.out"
        });
        const icon = e.currentTarget.querySelector('.action-icon');
        if (icon) {
            gsap.to(icon, { x: 5, duration: 0.3, ease: "back.out(2)" });
        }
    };

    const handleMouseLeave = (e) => {
        gsap.to(e.currentTarget, {
            scale: 1,
            boxShadow: "none",
            borderColor: "rgba(255, 255, 255, 0.05)",
            duration: 0.3,
            ease: "power2.out"
        });
        const icon = e.currentTarget.querySelector('.action-icon');
        if (icon) {
            gsap.to(icon, { x: 0, duration: 0.3, ease: "power2.out" });
        }
    };

    if (!freelancers || freelancers.length === 0) {
        return (
            <div className="glass-card rounded-2xl overflow-hidden p-8 text-center border border-white/10 relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="flex justify-between items-center mb-8 relative z-10">
                    <h3 className="font-display font-bold text-xl text-white flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                            <UserCheck className="w-5 h-5" />
                        </div>
                        Nearby Talent
                    </h3>
                    {userLocation && (
                        <div className="flex items-center gap-3 bg-white/5 p-1 pr-3 rounded-lg border border-white/10">
                            <span className="text-[10px] uppercase font-bold text-secondary tracking-wider ml-2">Radius</span>
                            <select
                                value={radius}
                                onChange={(e) => handleRadiusChange(Number(e.target.value))}
                                className="bg-transparent text-sm text-white focus:outline-none font-medium cursor-pointer"
                            >
                                <option value={5}>5 km</option>
                                <option value={15}>15 km</option>
                                <option value={25}>25 km</option>
                            </select>
                        </div>
                    )}
                </div>

                <div className="py-12 flex flex-col items-center gap-4 relative z-10">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center relative">
                        <div className="absolute inset-0 rounded-full border border-white/10 animate-ping opacity-20"></div>
                        <AlertCircle className="w-8 h-8 text-secondary opacity-50" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-white font-medium">No matches in this area</p>
                        <p className="text-secondary text-sm max-w-xs mx-auto">
                            We couldn't find specific matches within {radius}km. Try expanding your search range.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900/60 backdrop-blur-xl" ref={containerRef}>
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex flex-col gap-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-transparent opacity-50"></div>

                <div className="flex justify-between items-center relative z-10">
                    <h3 className="font-display font-bold text-xl text-white flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/20 ring-1 ring-blue-500/40 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        Nearby Talent
                    </h3>

                    <div className="flex items-center gap-3">
                        {userLocation && (
                            <div className="flex items-center gap-3 bg-white/5 p-1 pr-2 rounded-lg border border-white/10 hover:border-white/20 transition-colors group/select">
                                <span className="text-[10px] uppercase font-bold text-secondary tracking-wider ml-2 group-hover/select:text-blue-400 transition-colors">Radius</span>
                                <select
                                    value={radius}
                                    onChange={(e) => handleRadiusChange(Number(e.target.value))}
                                    className="bg-transparent text-sm text-white focus:outline-none font-medium cursor-pointer"
                                >
                                    <option value={5}>5 km</option>
                                    <option value={15}>15 km</option>
                                    <option value={25}>25 km</option>
                                </select>
                            </div>
                        )}
                        <span className="text-xs font-bold text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">
                            {loading ? 'Updating...' : `${freelancers.length} Available`}
                        </span>
                    </div>
                </div>

                {isFallback && (
                    <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent opacity-50"></div>
                        <Info className="w-5 h-5 text-amber-400 flex-shrink-0 relative z-10" />
                        <div className="relative z-10">
                            <p className="text-xs font-bold text-amber-200">Expanded Search Active</p>
                            <p className="text-[10px] text-amber-200/70">Showing top-rated professionals nearby outside your specific category.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* List */}
            <div className={`p-4 space-y-3 ${loading ? 'opacity-50 pointer-events-none grayscale' : ''} transition-all duration-300`}>
                {freelancers.map((f, index) => (
                    <div
                        key={f.id}
                        ref={el => cardsRef.current[index] = el}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer relative group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        <div className="flex justify-between items-start relative z-10">
                            <div className="flex gap-4">
                                {/* Avatar Placeholder / Visual */}
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center font-bold text-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                                    {f.name.charAt(0)}
                                </div>

                                <div>
                                    <h4 className="font-bold text-white text-base group-hover:text-blue-400 transition-colors flex items-center gap-2">
                                        {f.name}
                                        {f.rating >= 4.5 && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                                    </h4>
                                    <p className="text-sm text-secondary font-medium">{f.skill}</p>

                                    <div className="mt-2 flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
                                            <Star className="w-3 h-3 text-amber-400 fill-current" />
                                            <span className="text-xs font-bold text-amber-200">{f.rating}</span>
                                        </div>
                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {f.distance_km} km away
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button className="w-10 h-10 rounded-full bg-blue-500/10 hover:bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/20 transition-all group-hover:border-blue-500/50 action-icon">
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FreelancerList;
