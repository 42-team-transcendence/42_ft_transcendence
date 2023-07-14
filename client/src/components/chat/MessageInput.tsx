import { useState } from "react";

export default function MessageInput({send} : {send: (val:string) => void}) {
    const [value, setValue] = useState("");

    return (
        <>
            <input
                onChange={(e) => setValue(e.target.value)} 
                placeholder="Type your message here"
                value={value}>
            </input>
            <button onClick={() => send(value)}>click and send</button>
        </>
    )
}