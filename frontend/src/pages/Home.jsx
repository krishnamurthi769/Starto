import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Brain, Zap, Rocket } from 'lucide-react';
import gsap from 'gsap';
import logo from '../assets/logo.png';
import { Linkedin, Mail } from 'lucide-react';
import founderImg from '../assets/founder.png';
import cofounderImg from '../assets/cofounder.png';

const TeamMember = ({ name, role, image, bio, linkedin, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300"
        >
            <div className="aspect-[4/5] overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/90 via-[#020617]/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-2xl font-bold text-white mb-1">{name}</h3>
                <p className="text-blue-400 font-medium mb-3">{role}</p>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2 group-hover:line-clamp-none transition-all">
                    {bio}
                </p>

                <div className="flex gap-4">
                    <a
                        href={linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-white/5 hover:bg-blue-500 hover:text-white text-slate-400 transition-colors"
                    >
                        <Linkedin className="w-5 h-5" />
                    </a>
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-blue-500 hover:text-white text-slate-400 transition-colors">
                        <Mail className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const Home = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);

    // Floating Company Logos/Pills Data
    // Using Clearbit Logo API for real logos
    const team = [
        {
            name: "Krishna Murthi",
            role: "Founder",
            image: founderImg,
            bio: "Visionary leader with a passion for AI and sustainable technology. Formerly at TechGiant Inc.",
            linkedin: "https://www.linkedin.com/in/krishna-murthi-8547a5299/",
        },
        {
            name: "Rohith R",
            role: "Co-Founder",
            image: cofounderImg,
            bio: "Engineering genius specializing in large language models and neural networks. PhD from Stanford.",
            linkedin: "https://www.linkedin.com/in/rohith-r-124ba0271/",
        }
    ];

    const startups = [
        { name: "Swiggy", domain: "swiggy.com", x: "15%", y: "20%" },
        { name: "Zomato", domain: "zomato.com", x: "85%", y: "25%" },
        { name: "Blinkit", domain: "blinkit.com", x: "10%", y: "65%" },
        { name: "Zepto", domain: "zeptonow.com", x: "80%", y: "70%" },
        { name: "Cred", domain: "cred.club", x: "25%", y: "85%" },
        { name: "Razorpay", domain: "razorpay.com", x: "75%", y: "15%" },
        { name: "Flipkart", domain: "flipkart.com", x: "5%", y: "45%" },
        { name: "Zerodha", domain: "zerodha.com", x: "90%", y: "55%" }
    ];

    useEffect(() => {
        // Floating Animation for Bubbles
        const ctx = gsap.context(() => {
            gsap.utils.toArray('.startup-bubble').forEach((bubble, i) => {
                gsap.to(bubble, {
                    y: "random(-20, 20)",
                    x: "random(-10, 10)",
                    rotation: "random(-5, 5)",
                    duration: "random(2, 4)",
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: i * 0.2
                });
            });

            // Gentle parallax on mouse move
            const handleMouseMove = (e) => {
                const { clientX, clientY } = e;
                const xPos = (clientX / window.innerWidth - 0.5) * 20;
                const yPos = (clientY / window.innerHeight - 0.5) * 20;

                gsap.to('.hero-content', {
                    x: xPos,
                    y: yPos,
                    duration: 1,
                    ease: "power2.out"
                });

                gsap.to('.startup-bubble', {
                    x: (i) => (clientX / window.innerWidth - 0.5) * (30 + i * 5),
                    y: (i) => (clientY / window.innerHeight - 0.5) * (30 + i * 5),
                    duration: 2,
                    ease: "power2.out"
                });
            };

            window.addEventListener('mousemove', handleMouseMove);
            return () => window.removeEventListener('mousemove', handleMouseMove);
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen bg-[#050505] text-primary relative selection:bg-white selection:text-black font-sans flex flex-col overflow-x-hidden">

            {/* Background Gradient Mesh */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full opacity-50 mix-blend-screen" />
                <div className="absolute bottom-0 left-0 w-[800px] h-[600px] bg-purple-600/5 blur-[120px] rounded-full opacity-30 mix-blend-screen" />
            </div>

            {/* Navbar (Centered Logo Only) - Reduced Padding */}
            <nav className="relative z-50 pt-4 flex justify-center items-center flex-shrink-0">
                {/* Increased Logo Size & Centered */}
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative"
                >
                    <div className="absolute -inset-4 bg-white/5 blur-2xl rounded-full opacity-50"></div>
                    {/* Reduced logo size slightly to fit better */}
                    <img src={logo} alt="Starto Logo" className="h-24 md:h-40 w-auto object-contain relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                </motion.div>
            </nav>

            {/* Main Content - Force fit to remaining height */}
            <div className="relative z-10 hero-content flex-grow flex flex-col items-center justify-center text-center px-4 -mt-4">

                {/* Floating Startup Bubbles */}
                {startups.map((s, i) => (
                    <div
                        key={i}
                        className="startup-bubble absolute hidden md:flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 shadow-2xl bg-white/5 hover:bg-white/10 transition-colors"
                        style={{
                            top: s.y,
                            left: s.x,
                        }}
                    >
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden p-0.5">
                            <img
                                src={`https://logo.clearbit.com/${s.domain}`}
                                alt={s.name}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.style.backgroundColor = '#ccc';
                                }}
                            />
                        </div>
                        <span className="text-sm font-bold text-white/90 tracking-wide pr-1">{s.name}</span>
                    </div>
                ))}

                {/* Hero Text */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-4xl mx-auto relative z-20"
                >


                    <h1 className="text-5xl md:text-8xl font-bold mb-4 tracking-tighter leading-[0.9] text-white">
                        Build <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-600">Legendary</span> <br />
                        Startups.
                    </h1>

                    <p className="text-lg md:text-xl text-secondary mb-8 max-w-xl mx-auto leading-relaxed font-light">
                        Use AI & Location Intelligence to validate your idea before you write a single line of code.
                    </p>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/dashboard')}
                        className="group relative inline-flex items-center gap-4 px-8 py-4 bg-white text-black rounded-full font-bold text-lg transition-all hover:shadow-[0_0_50px_-10px_rgba(255,255,255,0.5)] overflow-hidden"
                    >
                        <span className="relative z-10">Start Analysis</span>
                        <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </motion.button>
                </motion.div>
            </div>

            {/* Team Section */}
            <div className="relative z-10 py-24 px-4 bg-gradient-to-b from-transparent to-[#020617]">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            Meet the <span className="text-blue-500">Minds</span>
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            The visionary team behind Starto, dedicated to revolutionizing the startup landscape with cutting-edge AI intelligence.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {team.map((member, index) => (
                            <TeamMember
                                key={member.name}
                                {...member}
                                delay={index * 0.2}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer / Features Hint */}
            <div className="w-full p-4 md:p-6 flex justify-center gap-8 opacity-30 text-white/50 text-xs font-medium uppercase tracking-widest hidden md:flex pb-12">
                <span>Location Intelligence</span>
                <span>•</span>
                <span>Market Saturation</span>
                <span>•</span>
                <span>AI Validation</span>
            </div>
        </div>
    );
};

export default Home;
