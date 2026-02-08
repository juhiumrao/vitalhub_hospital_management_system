'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import api from '@/lib/api';

export default function DoctorDashboard() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Consultation State
    const [selectedApt, setSelectedApt] = useState<any>(null);
    const [isConsultOpen, setIsConsultOpen] = useState(false);
    const [diagnosis, setDiagnosis] = useState('');
    const [medicines, setMedicines] = useState<{ name: string; dosage: string; duration: string }[]>([
        { name: '', dosage: '', duration: '' }
    ]);

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

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await api.patch(`/appointments/${id}/status`, { status });
            fetchAppointments(); // Refresh
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const openConsultation = (apt: any) => {
        setSelectedApt(apt);
        setDiagnosis(apt.symptoms || ''); // Pre-fill with symptoms or empty
        setMedicines([{ name: '', dosage: '', duration: '' }]);
        setIsConsultOpen(true);
    };

    const handleMedicineChange = (index: number, field: string, value: string) => {
        const newMeds = [...medicines];
        newMeds[index] = { ...newMeds[index], [field]: value };
        setMedicines(newMeds);
    };

    const addMedicine = () => {
        setMedicines([...medicines, { name: '', dosage: '', duration: '' }]);
    };

    const removeMedicine = (index: number) => {
        const newMeds = medicines.filter((_, i) => i !== index);
        setMedicines(newMeds);
    };

    const submitConsultation = async () => {
        if (!selectedApt) return;
        try {
            await api.patch(`/appointments/${selectedApt.id}/consult`, {
                diagnosis,
                medicines
            });
            setIsConsultOpen(false);
            fetchAppointments();
        } catch (err) {
            console.error(err);
            alert('Failed to complete consultation');
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Doctor Dashboard</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Appointments</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{appointments.length}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Pending</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-yellow-600">{appointments.filter(a => a.status === 'PENDING').length}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Completed</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-green-600">{appointments.filter(a => a.status === 'COMPLETED').length}</div></CardContent>
                </Card>
            </div>

            <h3 className="text-xl font-semibold mt-6">Patient Queue</h3>
            <div className="rounded-md border bg-white shadow-sm overflow-hidden">
                <div className="grid grid-cols-6 p-4 font-medium border-b bg-slate-50 text-slate-500 text-sm">
                    <div>PATIENT</div>
                    <div className="col-span-2">SYMPTOMS</div>
                    <div>DATE</div>
                    <div>STATUS</div>
                    <div className="text-right">ACTION</div>
                </div>
                {appointments.map((apt) => (
                    <div key={apt.id} className="grid grid-cols-6 p-4 border-b items-center hover:bg-slate-50 transition-colors">
                        <div className="font-medium">{apt.patient?.user?.name || 'Unknown'}</div>
                        <div className="col-span-2 text-sm text-slate-600 truncate pr-4" title={apt.symptoms}>{apt.symptoms}</div>
                        <div className="text-sm text-slate-500">{new Date(apt.date).toLocaleDateString()} {new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        <div>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold
                                ${apt.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                    apt.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                                        apt.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {apt.status}
                            </span>
                        </div>
                        <div className="text-right space-x-2">
                            {apt.status === 'PENDING' && (
                                <Button size="sm" onClick={() => handleStatusUpdate(apt.id, 'CONFIRMED')} className="bg-blue-600 hover:bg-blue-700">Accept</Button>
                            )}
                            {apt.status === 'CONFIRMED' && (
                                <Button size="sm" onClick={() => openConsultation(apt)} variant="default">Consult</Button>
                            )}
                            {apt.status === 'COMPLETED' && (
                                <Button size="sm" variant="outline" disabled>View</Button>
                            )}
                        </div>
                    </div>
                ))}
                {appointments.length === 0 && !loading && (
                    <div className="p-8 text-center text-muted-foreground">No appointments found.</div>
                )}
            </div>

            {/* Consultation Modal */}
            <Dialog open={isConsultOpen} onOpenChange={setIsConsultOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Consultation: {selectedApt?.patient?.user?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto px-1">
                        <div className="grid gap-2">
                            <Label>Diagnosis & Doctor's Notes</Label>
                            <Textarea
                                value={diagnosis}
                                onChange={(e) => setDiagnosis(e.target.value)}
                                placeholder="Enter diagnosis, clinical notes..."
                                className="h-24"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label>Prescription</Label>
                                <Button size="sm" variant="outline" onClick={addMedicine} type="button">
                                    <Plus className="h-4 w-4 mr-1" /> Add Medicine
                                </Button>
                            </div>
                            {medicines.map((med, index) => (
                                <div key={index} className="flex gap-2 items-start">
                                    <Input
                                        placeholder="Medicine Name"
                                        value={med.name}
                                        onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                                        className="flex-1"
                                    />
                                    <Input
                                        placeholder="Dosage (e.g. 500mg)"
                                        value={med.dosage}
                                        onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                                        className="w-32"
                                    />
                                    <Input
                                        placeholder="Duration"
                                        value={med.duration}
                                        onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                                        className="w-24"
                                    />
                                    <Button variant="ghost" size="icon" onClick={() => removeMedicine(index)} className="text-red-500">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsConsultOpen(false)}>Cancel</Button>
                        <Button onClick={submitConsultation}>Complete Consultation</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
