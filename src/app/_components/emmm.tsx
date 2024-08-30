'use client';
import { useState} from "react";
import '~/styles/SetName.css'
import {useRouter} from 'next/navigation'
import { api } from "~/trpc/react";
export default function Logger() {
    const[username, setUsername] = useState("");
    const router=useRouter();
        const transmit = () => {
        if(username !== ""){
            setUsername("");
            console.log(username);
            router.push(`/login?username=${encodeURIComponent(username)}`);
           }   
        }
  return (
 <>
   <div className="container">
        <input className="input" type="text" placeholder="your username" value={username} onChange={(event) => setUsername(event.target.value)}/>
        <button className="button" onClick={transmit}>Let's start</button>
    </div>
 </>   
)

}