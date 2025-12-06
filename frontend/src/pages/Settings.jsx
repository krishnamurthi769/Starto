import React from 'react';
import Sidebar from '../components/Sidebar';
import { Settings as SettingsIcon, User, Bell, Shield, Wallet } from 'lucide-react';

const Settings = () => {
    return (
        <div className="min-h-screen bg-[#050505] text-primary relative selection:bg-amber-500/30 selection:text-amber-100 font-sans overflow-x-hidden">
            <Sidebar />

            <main className="relative z-10 w-full pl-0 xl:pl-32 pr-6 py-12">
                <div className="max-w-4xl mx-auto space-y-8">
                    <header className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 text-secondary">
                            <SettingsIcon className="w-5 h-5" />
                            <span className="uppercase tracking-widest text-xs font-bold">Configuration</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white">Settings</h1>
                    </header>

                    <div className="space-y-4">
                        {[
                            { icon: User, label: 'Account Profile', desc: 'Manage your personal details and preferences.' },
                            { icon: Bell, label: 'Notifications', desc: 'Configure how you want to be alerted.' },
                            { icon: Shield, label: 'Privacy & Security', desc: 'Update password and security settings.' },
                            { icon: Wallet, label: 'Billing & Plans', desc: 'Manage your subscription and payment methods.' }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-white/5 text-white group-hover:bg-white group-hover:text-black transition-colors">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{item.label}</h3>
                                        <p className="text-sm text-secondary">{item.desc}</p>
                                    </div>
                                </div>
                                <button className="px-4 py-2 rounded-lg bg-white/5 text-sm font-bold text-secondary group-hover:bg-white group-hover:text-black transition-colors">
                                    Edit
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Settings;
