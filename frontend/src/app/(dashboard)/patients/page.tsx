'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';

export default function PatientsDirectory() {
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await api.get('/users?role=PATIENT');
                setPatients(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    if (loading) return <div className="p-8">Loading patients...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Patient Directory</h2>

            <div className="rounded-md border bg-white overflow-hidden">
                <div className="grid grid-cols-4 p-4 font-medium border-b bg-slate-50">
                    <div>Name</div>
                    <div>Email</div>
                    <div>Gender</div>
                    <div>Joined</div>
                </div>
                {patients.map((patient) => (
                    <div key={patient.id} className="grid grid-cols-4 p-4 border-b items-center hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={patient.profileImage} />
                                <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700">
                                    {patient.name?.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{patient.name}</span>
                        </div>
                        <div className="text-slate-500 text-sm">{patient.email}</div>
                        <div>
                            <Badge variant="outline" className="font-normal">
                                {patient.patientProfile?.gender || 'Other'}
                            </Badge>
                        </div>
                        <div className="text-slate-500 text-sm">
                            {new Date().toLocaleDateString()} {/* Mock join date if not in DB */}
                        </div>
                    </div>
                ))}
                {patients.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">No patients found.</div>
                )}
            </div>
        </div>
    );
}
