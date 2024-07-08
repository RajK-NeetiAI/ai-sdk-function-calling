import { UIState } from "@/app/actions";

interface MessagesProps {
    messages: UIState
}

export function ChatList({ messages }: MessagesProps) {
    if (!messages.length) {
        return null;
    }
    return (
        <div className="relative mx-auto max-w-sxl px-4">
            {messages.map((message) => {
                return (
                    <div key={message.id} className="pb-4">
                        {message.display}
                    </div>
                );
            })}
        </div>
    );
}