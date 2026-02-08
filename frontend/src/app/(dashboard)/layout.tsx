'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { User, Calendar, FileText, Settings, LogOut, LayoutDashboard, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            router.push('/login');
        } else {
            setUserRole(JSON.parse(user).role);
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    const menuItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'DOCTOR', 'PATIENT'] },
        { name: 'Appointments', href: '/appointments', icon: Calendar, roles: ['DOCTOR', 'PATIENT'] },
        { name: 'Patients', href: '/patients', icon: User, roles: ['DOCTOR', 'ADMIN'] },
        { name: 'Doctors', href: '/doctors', icon: Stethoscope, roles: ['PATIENT', 'ADMIN'] },
        { name: 'Records', href: '/records', icon: FileText, roles: ['PATIENT', 'DOCTOR', 'ADMIN'] },
        { name: 'Settings', href: '/settings', icon: Settings, roles: ['ADMIN', 'DOCTOR', 'PATIENT'] },
    ];

    return (
        <div className="flex h-screen bg-neutral-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r hidden md:flex flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-2xl font-bold text-primary">VitalHub</h1>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {menuItems.map((item) => {
                        // Simple role check logic
                        if (item.roles.includes(userRole || '')) {
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                        pathname.startsWith(item.href) || (pathname === '/patient' && item.href === '/dashboard' && userRole === 'PATIENT') || (pathname === '/doctor' && item.href === '/dashboard' && userRole === 'DOCTOR') || (pathname === '/admin' && item.href === '/dashboard' && userRole === 'ADMIN')
                                            ? "bg-slate-100 text-primary"
                                            : "text-neutral-600 hover:bg-slate-50 hover:text-primary"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.name}
                                </Link>
                            )
                        }
                        return null;
                    })}
                </nav>
                <div className="p-4 border-t">
                    <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white border-b flex items-center justify-between px-6">
                    <h2 className="text-lg font-semibold capitalize">{pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col text-right">
                            <span className="text-sm font-medium">{userRole}</span>
                        </div>
                        <div className="h-8 w-8 bg-slate-200 rounded-full" />
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
