'use client';

import { UIState } from "@/app/actions";
import { useEffect, useRef } from "react";

interface MessagesProps {
    messages: UIState
}

export function ChatList({ messages }: MessagesProps) {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    return (
        <div className="relative mx-auto max-w-sxl px-4" ref={messagesEndRef}>
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