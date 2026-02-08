import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-6 text-center">
      <div className="max-w-2xl space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
          Welcome to <span className="text-blue-600">VitalHub</span>
        </h1>
        <p className="text-lg text-slate-600">
          The next-generation Hospital Management System. Manage patients, appointments, and hospital resources seamlessly.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link href="/login">
            <Button size="lg" className="w-40 text-lg">Login</Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline" className="w-40 text-lg">Register</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
