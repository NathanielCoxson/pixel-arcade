'use client';
import { createUser } from "@/src/lib/actions"
import { useFormState } from "react-dom"

const initialState = {
    username: '',
    password: '',
    retypedPassword: '',
    message: '',
};

export default function Signup() {
    const [state, formAction] = useFormState(createUser, initialState);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-2">
            <h1 className="text-4xl font-bold">Signup</h1>
            <form action={formAction}>
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
                    <div className="flex min-w-full justify-between gap-2">
                        <label htmlFor="retypedPassword">Retype Password:</label>
                        <input
                            name="retypedPassword"
                            type="password"
                        ></input>
                    </div>
                    {state?.message && <p>{state?.message}</p>}
                    <button type='submit'>Submit</button>
                </div>
            </form>
        </main>
    )
}