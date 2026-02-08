'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await api.get('/appointments');
                setAppointments(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
            case 'CONFIRMED': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
            case 'COMPLETED': return 'bg-green-100 text-green-800 hover:bg-green-200';
            case 'CANCELLED': return 'bg-red-100 text-red-800 hover:bg-red-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div className="p-8">Loading appointments...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Appointments Management</h2>
                <Button>New Appointment</Button>
            </div>

            <div className="rounded-md border bg-white overflow-hidden shadow-sm">
                <div className="grid grid-cols-6 p-4 font-medium border-b bg-slate-50 text-sm text-slate-500">
                    <div>DATE</div>
                    <div>PATIENT</div>
                    <div>DOCTOR</div>
                    <div className="col-span-2">SYMPTOMS</div>
                    <div className="text-right">STATUS</div>
                </div>
                {appointments.map((apt) => (
                    <div key={apt.id} className="grid grid-cols-6 p-4 border-b items-center hover:bg-slate-50 transition-colors">
                        <div className="text-sm font-medium">
                            {new Date(apt.date).toLocaleDateString()}
                            <div className="text-xs text-slate-400">{new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                        <div className="font-medium text-slate-900">{apt.patient?.user?.name || 'Unknown'}</div>
                        <div className="text-slate-600">Dr. {apt.doctor?.user?.name || 'Unknown'}</div>
                        <div className="col-span-2 text-sm text-slate-500 truncate pr-4">{apt.symptoms}</div>
                        <div className="text-right">
                            <Badge variant="secondary" className={`${getStatusColor(apt.status)} border-0`}>
                                {apt.status}
                            </Badge>
                        </div>
                    </div>
                ))}

                {appointments.length === 0 && (
                    <div className="p-12 text-center text-muted-foreground">
                        No appointments found.
                    </div>
                )}
            </div>
        </div>
    );
}
