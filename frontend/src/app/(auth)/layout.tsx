import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
            <div className="w-full max-w-md p-4">
                <div className="flex flex-col items-center justify-center text-center mb-6">
                    <h1 className="text-3xl font-bold tracking-tight text-primary">VitalHub</h1>
                    <p className="text-muted-foreground mt-2">Hospital Management System</p>
                </div>
                {children}
            </div>
        </div>
    )
}
