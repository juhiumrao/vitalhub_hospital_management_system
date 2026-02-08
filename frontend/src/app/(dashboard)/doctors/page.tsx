'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import api from '@/lib/api';

export default function DoctorsDirectory() {
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await api.get('/users?role=DOCTOR');
                setDoctors(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    if (loading) return <div className="p-8">Loading directory...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Oue Specialists</h2>
                <Button variant="outline">Filter by Specialization</Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {doctors.map((doc) => (
                    <Card key={doc.id} className="flex flex-col hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={doc.profileImage} />
                                <AvatarFallback className="text-lg bg-blue-100 text-blue-700">
                                    {doc.name?.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-bold text-lg">{doc.name}</h3>
                                <Badge variant="secondary" className="mt-1">
                                    {doc.doctorProfile?.specialization || 'General Physician'}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-2 text-sm text-slate-600">
                            <div className="flex justify-between">
                                <span>Experience:</span>
                                <span className="font-medium text-slate-900">{doc.doctorProfile?.experience || 0} Years</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Consultation Fee:</span>
                                <span className="font-medium text-slate-900">${doc.doctorProfile?.consultationFee || 50}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Availability:</span>
                                <span className="text-green-600 font-medium">Mon - Fri</span>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-2">
                            <Link href="/patient/book" className="w-full">
                                <Button className="w-full">Book Appointment</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {doctors.length === 0 && (
                <div className="p-12 text-center bg-slate-50 rounded-lg dashed border">
                    No doctors available at the moment.
                </div>
            )}
        </div>
    );
}
