'use server';

import { auth } from "@/auth";
import { getFriends } from "@/src/lib/actions";
import Link from "next/link";

export default async function FriendsList() {
    const session = await auth();
    if (!session || !session?.user?.id) return;

    const { data: friends } = await getFriends(session?.user?.id);
    if (!friends || friends.length < 0) return <></>;

    return (
        <div className="flex flex-col border border-slate-500 rounded-md p-4">
           <h2 className="font-semibold text-2xl">Friends</h2> 
           {friends.map((friend: any) => {
               return <Link 
                   href={`/dashboard/${friend.username}`} 
                   key={`friend-${friend.friend}`}
                   className="text-xl hover:font-semibold transition-all"
               >
                   {friend.username}
               </Link>;
           })}
        </div>
    );
}
