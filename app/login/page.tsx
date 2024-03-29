"use client";

import { useFormState } from "react-dom";
import { authenticate } from "@/src/lib/authActions";
import Link from "next/link";

export default function Login() {
    const [errorMessage, dispatch] = useFormState(authenticate, undefined);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-2">
            <h1 className="text-4xl font-bold">Login</h1>
            <form action={dispatch}>
                <div className="flex flex-col gap-1">
                    <div className="flex w-full justify-between gap-2">
                        <label htmlFor="username">Username:</label>
                        <input
                            name="username"
                            type="text"
                        ></input>
                    </div>
                    <div className="flex min-w-full justify-between gap-2">
                        <label htmlFor="password">Password:</label>
                        <input
                            name="password"
                            type="password"
                        ></input>
                    </div>
                    <p>{errorMessage}</p>
                    <button type='submit'>Submit</button>
                </div>
            </form>
            <div className="flex items-center gap-4">
                <h2>Need an account?</h2>
                <Link href="/signup">Sign Up</Link>
            </div>
        </main>
    )
}
