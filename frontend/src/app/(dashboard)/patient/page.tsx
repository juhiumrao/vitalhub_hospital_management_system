'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function PatientDashboard() {
    const [appointments, setAppointments] = useState<any[]>([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await api.get('/appointments');
                setAppointments(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchAppointments();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">My Health Dashboard</h2>
                <Link href="/patient/book">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Book Appointment
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {/* Quick Stats or Cards */}
                <Card>
                    <CardHeader><CardTitle>Upcoming</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{appointments.filter(a => a.status === 'PENDING' || a.status === 'CONFIRMED').length}</div>
                    </CardContent>
                </Card>
            </div>

            <h3 className="text-xl font-semibold mt-6">Appointment History</h3>
            <div className="rounded-md border bg-white">
                <div className="grid grid-cols-4 p-4 font-medium border-b bg-slate-50">
                    <div>Doctor</div>
                    <div>Date</div>
                    <div>Status</div>
                    <div>Notes</div>
                </div>
                {appointments.map((apt) => (
                    <div key={apt.id} className="grid grid-cols-4 p-4 border-b items-center">
                        <div>{apt.doctor?.user?.name || 'Unknown'}</div>
                        <div>{new Date(apt.date).toLocaleDateString()}</div>
                        <div>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${apt.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                    apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                                {apt.status}
                            </span>
                        </div>
                        <div>{apt.prescription ? 'Prescription Available' : '-'}</div>
                    </div>
                ))}
                {appointments.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">No history found.</div>
                )}
            </div>
        </div>
    );
}
