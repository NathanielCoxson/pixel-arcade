'use client';
import { acceptFriendRequest, getFriendRequests, rejectFriendRequest } from "@/src/lib/actions";
import { FriendRequest } from "../types";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import FriendRequestEntry from "./FriendRequestEntry";

export default function FriendRequestsPanel() {
    const { data: session } = useSession();
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
    const [hidden, setHidden] = useState<boolean>(true);

    useEffect(() => {
        if (!session) return;
        async function getRequests() {
            const { data: requests } = await getFriendRequests(session?.user?.name);
            if (requests.length > 0) setHidden(false);
            setFriendRequests(requests);
        }
        getRequests();
    }, [session]);

    async function handleAcceptOrReject(id: string, accepted: boolean) {
        if (accepted) {
            await acceptFriendRequest(id);
        } else {
            await rejectFriendRequest(id);
        }
        if (friendRequests.length === 1) setHidden(true);
        setFriendRequests(prev => prev.filter((req: FriendRequest) => req.id !== id));
    }

    useEffect(() => console.log(hidden), [hidden]);

    return (
        <>
            {!hidden && <div>
                <h2>Friend Requests:</h2>
                {friendRequests.map((req: FriendRequest) => <FriendRequestEntry key={req.id} request={req} onClick={handleAcceptOrReject}/>)}
            </div>}
        </>
    )
}
