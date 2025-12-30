import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { storage } from '../utils/StorageUtils';
import Layout from '../components/Layout';
import Card from '../components/Card';
import UserList from '../components/UserList';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Activity, Coffee, LayoutDashboard, UserCog } from 'lucide-react';

const COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b', '#10b981'];

const AdminDashboard = () => {
    const { user, loading } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (loading) return;
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        setStats(storage.getStats());
    }, [user, loading, navigate]);

    if (!stats) return null;

    return (
        <Layout>
            <div className="space-y-8 pt-16">
                <header>
                    <h1 className="text-3xl font-bold text-gradient mb-2">{t('dashboard')}</h1>
                    <p className="text-muted">{t('dashboardDesc')}</p>

                    <div className="flex gap-4 mt-6 border-b border-white/10">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === 'overview' ? 'text-primary' : 'text-muted hover:text-text'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <LayoutDashboard size={16} />
                                Overview
                            </div>
                            {activeTab === 'overview' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === 'users' ? 'text-primary' : 'text-muted hover:text-text'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <UserCog size={16} />
                                User Management
                            </div>
                            {activeTab === 'users' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                            )}
                        </button>
                    </div>
                </header>

                {activeTab === 'overview' ? (
                    <div className="space-y-8">
                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-primary/10 text-primary">
                                    <Activity className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted">{t('totalLogs')}</p>
                                    <p className="text-2xl font-bold">{stats.totalLogs}</p>
                                </div>
                            </Card>

                            <Card className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-secondary/10 text-secondary">
                                    <Coffee className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted">{t('recentActivity')}</p>
                                    <p className="text-2xl font-bold">{stats.recentActivity}</p>
                                </div>
                            </Card>

                            <Card className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-accent/10 text-accent">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted">{t('activeUsers')}</p>
                                    <p className="text-2xl font-bold">Mock Data</p>
                                </div>
                            </Card>
                        </div>

                        {/* Charts */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card>
                                <h3 className="text-lg font-semibold mb-6">{t('emotionDist')}</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={stats.emotionData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {stats.emotionData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1e293b', borderColor: 'rgba(255,255,255,0.1)' }}
                                                itemStyle={{ color: '#f8fafc' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>

                            <Card>
                                <h3 className="text-lg font-semibold mb-6">{t('popularMoods')}</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stats.emotionData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                            <YAxis stroke="#94a3b8" fontSize={12} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1e293b', borderColor: 'rgba(255,255,255,0.1)' }}
                                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                            />
                                            <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <UserList />
                )}
            </div>
        </Layout>
    );
};

export default AdminDashboard;
