'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge'; // User might not have this, I will use span or standard class if missing. I'll stick to span to be safe.
import { FileText, Pill } from 'lucide-react';
import api from '@/lib/api';

export default function RecordsPage() {
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                // Fetch all appointments. 
                // The backend automatically filters by the logged-in user.
                // We filter for completed ones on the frontend for now, or the backend could do it.
                const res = await api.get('/appointments');
                const completed = res.data.filter((a: any) => a.status === 'COMPLETED');
                setRecords(completed);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecords();
    }, []);

    if (loading) return <div className="p-8">Loading records...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Medical Records</h2>

            <div className="grid gap-6">
                {records.map((record) => (
                    <Card key={record.id} className="overflow-hidden">
                        <CardHeader className="bg-slate-50 border-b py-3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-semibold text-lg">{new Date(record.date).toLocaleDateString()}</div>
                                    <div className="text-sm text-muted-foreground">Dr. {record.doctor?.user?.name || 'Unknown'}</div>
                                </div>
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
                                    COMPLETED
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {/* Diagnosis Section */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="flex items-center text-sm font-semibold text-slate-500 mb-2">
                                        <FileText className="h-4 w-4 mr-2" />
                                        DIAGNOSIS & NOTES
                                    </h4>
                                    <p className="text-slate-900 bg-slate-50 p-3 rounded-md border min-h-[60px]">
                                        {record.symptoms || record.prescription?.notes || "No notes available."}
                                    </p>
                                </div>

                                {/* Medicines Section */}
                                <div>
                                    <h4 className="flex items-center text-sm font-semibold text-slate-500 mb-2">
                                        <Pill className="h-4 w-4 mr-2" />
                                        PRESCRIPTION
                                    </h4>
                                    {record.prescription?.medicines && Array.isArray(record.prescription.medicines) ? (
                                        <div className="border rounded-md divide-y">
                                            {record.prescription.medicines.map((med: any, idx: number) => (
                                                <div key={idx} className="p-3 flex justify-between items-center text-sm">
                                                    <span className="font-medium">{med.name}</span>
                                                    <div className="text-slate-500 space-x-2">
                                                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{med.dosage}</span>
                                                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{med.duration}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-muted-foreground italic p-2">No medicines prescribed.</div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {records.length === 0 && (
                    <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed">
                        <h3 className="text-lg font-medium text-slate-900">No medical records found</h3>
                        <p className="text-slate-500">Completed appointments and prescriptions will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
