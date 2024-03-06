"use client";
import { createFriendRequest, getUsersWhereUsernameStartsWith } from "@/src/lib/actions";
import { SyntheticEvent, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { navigate } from "@/src/lib/actions";

export default function AddFriend() {
    const { data: session } = useSession();
    if (!session) {
        navigate("/");
    }

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchResults, setSearchResults] = useState<{username: string, id: string}[]>([]);
    const [response, setResponse] = useState<string | null>(null);


    async function handleSubmit(e: SyntheticEvent) {
        e.preventDefault();
        // Search for users, then filter out current user.
        const result = (await getUsersWhereUsernameStartsWith(searchTerm))
            .filter((user: any) => user.username !== session?.user?.name);
        setSearchResults(result);
    }

    async function handleAddFriend(e: SyntheticEvent, receiver: { username: string, id: string }) {
        e.preventDefault();
        const { success, message } = await createFriendRequest(session?.user?.id, receiver.id);
        if (success) {
            setResponse(`Friend request successfully sent to : ${receiver.username}`);
            setSearchResults(prev => prev.filter((result: { username: string, id: string}) => result.id !== receiver.id));
        } else {
            setResponse(message);
        }
    }

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
                {searchResults.map((result: { username: string, id: string }) => <li key={result.username} className="flex gap-4">
                        <Link 
                            href={`/dashboard/${result.username}`}
                            className="hover:font-bold transition-all"
                            onClick={(e) => handleAddFriend(e, result)}
                        >
                            {result.username}
                        </Link>
                </li>)}
            </ul>}

            {response && <div>{response}</div>}
        </main>
    )
}
