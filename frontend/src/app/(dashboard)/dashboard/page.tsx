'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.role === 'ADMIN') router.push('/admin');
            else if (user.role === 'DOCTOR') router.push('/doctor');
            else router.push('/patient');
        } else {
            router.push('/login');
        }
    }, [router]);

    return <div className="flex items-center justify-center h-full">Redirecting...</div>
}
