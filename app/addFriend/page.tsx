"use client";
import { getUsersWhereUsernameStartsWith } from "@/src/lib/actions";
import { SyntheticEvent, useState } from "react";
import Link from "next/link";

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

    //async function handleAddFriend(e: SyntheticEvent) {
    //    e.preventDefault();

    //}

    return (
        <main className="flex min-h-screen flex-col items-center justify-center text-center p-24 gap-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label htmlFor="search">Search for a user:</label>
                <input
                    name="search" 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Username"
                    className="p-1"
                ></input>
                <button type="submit">Search</button>
            </form>


            {searchResults.length > 0 && <ul>
                {searchResults.map((result: string) => <li key={result} className="flex gap-4">
                        <Link 
                            href={`/dashboard/${result}`}
                            className="hover:font-bold transition-all"
                        >
                            {result}
                        </Link>
                </li>)}
            </ul>}

        </main>
    )
}
