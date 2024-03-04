"use client";
import { getUsersWhereUsernameStartsWith } from "@/src/lib/actions";
import { SyntheticEvent, useState } from "react";
export default function AddFriend() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchResults, setSearchResults] = useState<string[]>([]);

    async function handleSubmit(e: SyntheticEvent) {
        e.preventDefault();
        console.log(searchTerm);
        const result = await getUsersWhereUsernameStartsWith(searchTerm);
        setSearchResults(result.map((result: any) => result.username));
        console.log(result);
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center text-center p-24 gap-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label htmlFor="search">Search for user:</label>
                <input name="search" onChange={(e) => setSearchTerm(e.target.value)}></input>
                <button type="submit">Search</button>
            </form>

            <ul>
                {searchResults.map((result: string) => <li key={result}>{result}</li>)}
            </ul>

        </main>
    )
}
