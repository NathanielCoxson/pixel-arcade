'use client';
import { acceptFriendRequest, rejectFriendRequest } from "@/src/lib/actions";
import { FriendRequest } from "../types";
import { useState } from "react";
export default function FriendRequestEntry(
    props: {
        request: FriendRequest,
        onClick: Function,
    }
) {

    return (
        <div className="flex gap-4">
            <h2>Request from: {props.request.senderUsername}</h2>
            <span className="cursor-pointer" onClick={(_) => props.onClick(props.request.id, true)}>✓</span>
            <span className="cursor-pointer" onClick={(_) => props.onClick(props.request.id, false)}>X</span>
        </div>
    ) 
}
