'use server';

import Link from "next/link";

const friends = [{uid: '1234', username: 'asdf'}];

export default async function FriendsList() {
    if (friends.length < 0) return <></>;

    return (
        <div className="flex flex-col">
           <h2 className="font-semibold text-2xl">Friends List</h2> 
           {friends.map((friend: any) => {
               return <Link 
                   href={`/dashboard/${friend.username}`} 
                   key={`friend-${friend.uid}`}
                   className="text-xl hover:font-semibold transition-all"
               >
                   {friend.username}
               </Link>;
           })}
        </div>
    );
}
