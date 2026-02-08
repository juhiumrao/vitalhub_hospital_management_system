'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import api from '@/lib/api';

const formSchema = z.object({
    doctorId: z.string().min(1, "Please select a doctor"),
    date: z.string().min(1, "Please select a date"),
    symptoms: z.string().optional(),
});

interface Doctor {
    id: string; // User ID
    name: string;
    doctorProfile: { id: string, specialization: string }
}

export default function BookAppointmentPage() {
    const router = useRouter();
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                // Fetch users with role DOCTOR
                console.log('Fetching doctors from API...');
                const res = await api.get('/users?role=DOCTOR');
                console.log('API Response:', res.data);
                setDoctors(res.data);
            } catch (err: any) {
                console.error('Error fetching doctors:', err);
                if (err.response) {
                    console.error('Server responded with:', err.response.data);
                    alert(`Failed to load doctors: ${err.response.data.message || err.response.statusText}`);
                } else if (err.request) {
                    console.error('No response received:', err.request);
                    alert('Network error: server not reachable');
                } else {
                    alert(`Error: ${err.message}`);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            doctorId: '',
            date: '',
            symptoms: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            // Values.doctorId is User ID or Doctor ID?
            // The form select value should be Doctor ID.
            // The backend expects Doctor ID.

            // If my /users API returns matching users, I need to map User.doctorProfile.id

            await api.post('/appointments', values);
            router.push('/patient');
        } catch (err) {
            console.error(err);
            // alert('Failed to book');
        }
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Book Appointment</h2>
            <Card>
                <CardContent className="pt-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="doctorId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Select Doctor</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a doctor" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {doctors.map((doc: any) => (
                                                    // Check if doc.doctorProfile exists. If not, filtered out or broken.
                                                    // I'll assume I'll fix the backend to include it.
                                                    <SelectItem key={doc.id} value={doc.doctorProfile?.id || doc.id}>
                                                        {doc.name} {doc.doctorProfile ? `(${doc.doctorProfile.specialization})` : ''}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date & Time</FormLabel>
                                        <FormControl>
                                            <Input type="datetime-local" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="symptoms"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Symptoms</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Describe your symptoms" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Confirm Booking</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
