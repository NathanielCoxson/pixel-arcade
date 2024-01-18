'use client';

import { useSession } from "next-auth/react";

export default function Dashboard() {
    const { data: session } = useSession();

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-2">
            <h1>Hello {session?.user?.name}</h1>
        </main>
    )
}