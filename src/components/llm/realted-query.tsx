"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { RelatedSearch } from '@/lib/tools/search-internet';
import { useActions, useUIState } from 'ai/rsc';
import { AI } from '@/app/actions';
import { UserMessage } from '@/components/llm/message';


export function RelatedQueryButton({ relatedSearch }: { relatedSearch: RelatedSearch[] }) {
    const [messages, setMessages] = useUIState<typeof AI>();
    const { sendMessage } = useActions<typeof AI>();
    const onClick = async (query: string) => {
        setMessages((currentMessages) => [
            ...currentMessages,
            {
                id: Date.now(),
                role: 'user',
                display: <UserMessage>{query}</UserMessage>
            }
        ]);
        try {
            const responseMessage = await sendMessage(query);
            setMessages((currentMessages) => [
                ...currentMessages,
                responseMessage
            ]);
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div className="flex flex-wrap max-h-[5.5rem] overflow-hidden mt-12">
            {relatedSearch.map((rs, index) => (
                <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="m-1"
                    onClick={() => onClick(rs.query)}
                >
                    {rs.query}
                </Button>
            ))}
        </div>
    );
};
