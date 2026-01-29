import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Droplet, 
    Activity, 
    Users, 
    Settings, 
    LogOut,
    Menu,
    X,
    Bell
} from 'lucide-react';

const DashboardLayout = ({ children, role = 'hospital' }) => {
    const [sidebarOpen, setSidebarOpen] = React.useState(true);
    const location = useLocation();

    // Define navigation items based on role (Phase 1: Foundation)
    const navItems = {
        hospital: [
            { icon: LayoutDashboard, label: 'Overview', path: '/hospital-dashboard' },
            { icon: Activity, label: 'Emergency Requests', path: '/emergency' },
            { icon: Droplet, label: 'Inventory', path: '/inventory' }, // Future
            { icon: Users, label: 'Donors', path: '/donors' },
        ],
        blood_bank: [
            { icon: LayoutDashboard, label: 'Overview', path: '/blood-bank-dashboard' },
            { icon: Droplet, label: 'Inventory Management', path: '/inventory' },
            { icon: Activity, label: 'Incoming Requests', path: '/emergency' },
        ],
        admin: [
            { icon: LayoutDashboard, label: 'Command Center', path: '/admin-dashboard' },
            { icon: Users, label: 'User Management', path: '/admin/users' },
            { icon: Settings, label: 'System Config', path: '/admin/settings' },
        ]
    };

    const currentNav = navItems[role] || navItems['hospital'];

    return (
        <div className="flex h-screen bg-transparent">
            {/* Sidebar - Professional Dark Mode */}
            <aside 
                className={`
                    fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:relative lg:translate-x-0
                `}
            >
                <div className="flex h-16 items-center justify-center border-b border-slate-800">
                    <h1 className="text-xl font-bold tracking-tight text-teal-400">BEOS <span className="text-white text-xs font-normal opacity-50">PRO</span></h1>
                </div>

                <nav className="mt-6 px-3 space-y-1">
                    {currentNav.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                                    flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors
                                    ${isActive 
                                        ? 'bg-teal-600 text-white' 
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                                `}
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
                    <button className="flex w-full items-center px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">
                        <LogOut className="mr-3 h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header - Global Status */}
                <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shadow-sm z-40">
                    <button 
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden p-2 text-slate-500 hover:text-slate-700"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex-1 flex justify-end items-center space-x-6">
                        {/* Global Status Ticker could go here */}
                        <div className="hidden md:flex items-center text-sm text-slate-500">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                            System Operational
                        </div>
                        
                        <button className="relative p-2 text-slate-400 hover:text-slate-600">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500"></span>
                        </button>
                        
                        <div className="flex items-center space-x-3 border-l border-slate-200 pl-6">
                            <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xs">
                                JD
                            </div>
                            <div className="hidden md:block text-sm">
                                <p className="font-medium text-slate-800">John Doe</p>
                                <p className="text-xs text-slate-500 capitalize">{role.replace('_', ' ')} Admin</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Canvas */}
                <main className="flex-1 overflow-auto bg-slate-50 p-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
