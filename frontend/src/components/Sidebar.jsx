import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, BarChart3, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/dashboard', icon: Home, label: 'Home' },
        { path: '/analytics', icon: BarChart3, label: 'Analytics' },
        { path: '/settings', icon: Settings, label: 'Settings' }
    ];

    return (
        <motion.aside
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-6 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl"
        >
            <div className="p-2 bg-white/10 rounded-xl mb-4">
                <img src={logo} alt="S" className="w-6 h-6 object-contain" />
            </div>

            {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`p-3 rounded-xl transition-all ${active
                            ? 'bg-white/10 text-white scale-105 shadow-lg shadow-white/5'
                            : 'text-secondary hover:bg-white/10 hover:text-white hover:scale-105'
                            }`}
                        title={item.label}
                    >
                        <Icon className="w-5 h-5" />
                    </button>
                );
            })}
        </motion.aside>
    );
};

export default Sidebar;
