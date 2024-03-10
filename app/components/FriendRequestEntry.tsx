'use client';
import { FriendRequest } from "../types";
export default function FriendRequestEntry(
    props: {
        request: FriendRequest,
    }
) {
    function handleAccept(_: any) {
        console.log(`Accepting ${props.request.id}`)
    }

    function handleReject(_: any) {

    }

    return (
        <div className="flex gap-4">
            <h2>Request from: {props.request.senderUsername}</h2>
            <span className="cursor-pointer" onClick={handleAccept}>✓</span>
            <span className="cursor-pointer" onClick={handleReject}>X</span>
        </div>
    ) 
}
