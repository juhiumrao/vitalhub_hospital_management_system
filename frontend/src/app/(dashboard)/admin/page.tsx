'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Users, Bed, CreditCard } from 'lucide-react';
import api from '@/lib/api';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        doctors: 0,
        patients: 0,
        appointments: 0,
        revenue: 0 // Mocked or calculated
    });

    // Simulate 50 beds
    // Persist in local storage for demo feel if we wanted, but state is fine.
    const [beds, setBeds] = useState(Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        status: Math.random() > 0.8 ? 'OCCUPIED' : 'AVAILABLE',
        patientName: Math.random() > 0.8 ? 'John Doe' : null,
    })));

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Parallel fetch for speed
                const [docs, pats, appts] = await Promise.all([
                    api.get('/users?role=DOCTOR'),
                    api.get('/users?role=PATIENT'),
                    api.get('/appointments')
                ]);

                // Calculate revenue (mock logic: 50 per completed appointment)
                const completedAppts = appts.data.filter((a: any) => a.status === 'COMPLETED').length;

                setStats({
                    doctors: docs.data.length,
                    patients: pats.data.length,
                    appointments: appts.data.length,
                    revenue: completedAppts * 50
                });
            } catch (err) {
                console.error('Failed to load admin stats', err);
            }
        };
        fetchStats();
    }, []);

    const toggleBed = (id: number) => {
        setBeds(beds.map(bed => {
            if (bed.id === id) {
                const newStatus = bed.status === 'AVAILABLE' ? 'OCCUPIED' : 'AVAILABLE';
                return {
                    ...bed,
                    status: newStatus,
                    patientName: newStatus === 'OCCUPIED' ? 'Admitted Patient' : null
                };
            }
            return bed;
        }));
    };

    const occupiedCount = beds.filter(b => b.status === 'OCCUPIED').length;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Hospital Administration</h2>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.revenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Doctors</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.doctors}</div>
                        <p className="text-xs text-muted-foreground">Currently on shift</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Patients Registered</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.patients}</div>
                        <p className="text-xs text-muted-foreground">+180 new this week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bed Occupancy</CardTitle>
                        <Bed className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{occupiedCount} / 50</div>
                        <p className="text-xs text-muted-foreground">
                            {((occupiedCount / 50) * 100).toFixed(0)}% Capacity
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-4 text-slate-800">Bed Management (Live View)</h3>
                <div className="grid grid-cols-5 gap-3 md:grid-cols-8 lg:grid-cols-10">
                    {beds.map((bed) => (
                        <div
                            key={bed.id}
                            onClick={() => toggleBed(bed.id)}
                            className={`
                  h-14 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-md border-2
                  ${bed.status === 'OCCUPIED'
                                    ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                                    : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'}
                `}
                            title={bed.status === 'OCCUPIED' ? `Occupied` : 'Available - Click to Admit'}
                        >
                            <Bed className="h-4 w-4 mb-1 opacity-80" />
                            <span className="text-xs font-bold">Bed {bed.id}</span>
                        </div>
                    ))}
                </div>
                <div className="flex gap-4 mt-4 text-sm text-slate-500">
                    <div className="flex items-center"><div className="w-3 h-3 bg-emerald-100 border-2 border-emerald-200 rounded mr-2"></div> Available</div>
                    <div className="flex items-center"><div className="w-3 h-3 bg-red-100 border-2 border-red-200 rounded mr-2"></div> Occupied</div>
                </div>
            </div>
        </div>
    );
}
