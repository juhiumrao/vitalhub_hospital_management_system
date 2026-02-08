'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/lib/api';

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Determine current user ID from token or logic
                // For simplicity, we decode token or just assume we know who logged in.
                // Better approach: endpoint /auth/me or similar.
                // Here we cheat and filter /users?role=MYROLE and match email, OR
                // Update backend to have /auth/profile.
                // Let's assume we saved user ID in local storage on login.
                const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                if (storedUser.id) {
                    const res = await api.get(`/users/${storedUser.id}`);
                    setUser(res.data);

                    // Init form data
                    const u = res.data;
                    setFormData({
                        name: u.name,
                        email: u.email,
                        specialization: u.doctorProfile?.specialization || '',
                        experience: u.doctorProfile?.experience || '',
                        consultationFee: u.doctorProfile?.consultationFee || '',
                        gender: u.patientProfile?.gender || '',
                        bloodGroup: u.patientProfile?.bloodGroup || '',
                        address: u.patientProfile?.address || '',
                    });
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSave = async () => {
        if (!user) return;
        try {
            const payload: any = {
                name: formData.name,
                email: formData.email,
            };

            if (user.role === 'DOCTOR') {
                payload.doctorProfile = {
                    specialization: formData.specialization,
                    experience: formData.experience,
                    consultationFee: formData.consultationFee
                };
            } else if (user.role === 'PATIENT') {
                payload.patientProfile = {
                    gender: formData.gender,
                    bloodGroup: formData.bloodGroup,
                    address: formData.address
                };
            }

            await api.patch(`/users/${user.id}`, payload);
            alert('Profile updated successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to update profile.');
        }
    };

    if (loading) return <div className="p-8">Loading settings...</div>;
    if (!user) return <div className="p-8">User not found. Please log in.</div>;

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">Manage your account settings and preferences.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={formData.email} disabled className="bg-slate-100" />
                    </div>

                    {user.role === 'DOCTOR' && (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="specialization">Specialization</Label>
                                <Select value={formData.specialization} onValueChange={(v) => handleChange('specialization', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="General">General Physician</SelectItem>
                                        <SelectItem value="Cardiology">Cardiology</SelectItem>
                                        <SelectItem value="Dermatology">Dermatology</SelectItem>
                                        <SelectItem value="Neurology">Neurology</SelectItem>
                                        <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="experience">Experience (Years)</Label>
                                    <Input id="experience" type="number" value={formData.experience} onChange={(e) => handleChange('experience', e.target.value)} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="fee">Consultation Fee ($)</Label>
                                    <Input id="fee" type="number" value={formData.consultationFee} onChange={(e) => handleChange('consultationFee', e.target.value)} />
                                </div>
                            </div>
                        </>
                    )}

                    {user.role === 'PATIENT' && (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select value={formData.gender} onValueChange={(v) => handleChange('gender', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="blood">Blood Group</Label>
                                <Select value={formData.bloodGroup} onValueChange={(v) => handleChange('bloodGroup', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="A+">A+</SelectItem>
                                        <SelectItem value="A-">A-</SelectItem>
                                        <SelectItem value="B+">B+</SelectItem>
                                        <SelectItem value="B-">B-</SelectItem>
                                        <SelectItem value="O+">O+</SelectItem>
                                        <SelectItem value="O-">O-</SelectItem>
                                        <SelectItem value="AB+">AB+</SelectItem>
                                        <SelectItem value="AB-">AB-</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" value={formData.address} onChange={(e) => handleChange('address', e.target.value)} />
                            </div>
                        </>
                    )}

                    <div className="pt-4">
                        <Button onClick={handleSave}>Save Changes</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
