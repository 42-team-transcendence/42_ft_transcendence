
export default function Messages({messages}:{messages : string[]}) {

    return (
        <>
            <h3>Messages</h3>
            <ul>
                {messages.map((msg, index) => {
                    return <li key={index}>{msg}</li>
                })}
            </ul>
        </>
    )

}