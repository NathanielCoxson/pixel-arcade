'use client'

import { useState } from "react";

export default function Signup() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [retypedPassword, setRetypedPassword] = useState<string>('');

    function handleSubmit(event: any) {
        console.log({username, password, retypedPassword});
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-2">
            <h1 className="text-4xl font-bold">Signup</h1>
            <div className="flex flex-col gap-1">
                <div className="flex w-full justify-between gap-2">
                    <label htmlFor="username">Username:</label>
                    <input
                        name="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    ></input>
                </div>
                <div className="flex min-w-full justify-between gap-2">
                    <label htmlFor="password">Password:</label>
                    <input
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></input>
                </div>
                <div className="flex min-w-full justify-between gap-2">
                    <label htmlFor="retypedPassword">Retype Password:</label>
                    <input
                        name="retypedPassword"
                        type="password"
                        value={retypedPassword}
                        onChange={(e) => setRetypedPassword(e.target.value)}
                    ></input>
                </div>
                <button onClick={handleSubmit}>Submit</button>
            </div>
        </main>
    )
}