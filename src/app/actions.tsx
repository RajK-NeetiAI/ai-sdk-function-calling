"use server";

import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { ReactNode } from "react";
import type { CoreMessage, ToolInvocation } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { env } from "@/env.mjs";
import { BotMessage, BotCard } from "@/components/llm/message";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { generateSummary, processSerperResponse, searchGoogleSerper } from "@/lib/tools/search-internet";

// System message
const systemMessage = `You are a helpful assistant and you can help users get the information they are 
looking for, and besides that you can also chat with the user.

Use the \`get_internet_serach\` to fetch the latest information from internet, use your judgment to 
decide if you want to use the internet or not.
If not clear about the search please ask user for clarification before making the 
\`get_internet_serach\` call.`;

const openai = createOpenAI({
    apiKey: env.OPENAI_API_KEY
});

const groq = createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: env.GROQ_API_KEY,
});

export const sendMessage = async (message: string): Promise<{
    id: number,
    role: "user" | "assistant",
    display: ReactNode
}> => {
    const aiState = getMutableAIState<typeof AI>();
    aiState.update([
        ...aiState.get(),
        {
            role: "user",
            content: message
        }
    ]);
    const reply = await streamUI({
        model: groq(env.GROQ_MODEL),
        messages: [
            { role: 'system', content: systemMessage, toolInvocations: [] },
            ...aiState.get()
        ] as CoreMessage[],
        initial: (
            <BotCard className="items-center flex shrink-0 select-none justify-center">
                <Loader2 className="w-5 animate-spin stroke-zinc-900"></Loader2>
            </BotCard>
        ),
        text: ({ content, done }) => {
            if (done) {
                aiState.done([...aiState.get(), { role: 'assistant', content: content }]);
            }
            return <BotMessage
                summary={content}
            ></BotMessage>;
        },
        temperature: 0.0,
        tools: {
            get_internet_serach: {
                description: "Get the current information from the internet about the, use this to search internet.",
                parameters: z.object({
                    query: z.string().describe("stand alone query to search the internet.")
                }),
                generate: async function* ({ query }: { query: string }) {
                    console.log(`Generated query: ${query}.`);
                    yield <BotCard>
                        <Loader2 className="w-5 animate-spin stroke-zinc-900"></Loader2>
                    </BotCard>
                    const serperResponse = await searchGoogleSerper(query);
                    const processedResponse = await processSerperResponse(serperResponse);
                    yield <BotMessage
                        query={query}
                        images={processedResponse.images}
                        topStories={processedResponse.topStories}
                        relatedSearch={processedResponse.relatedSearches}
                    ></BotMessage>
                    const summary = await generateSummary(serperResponse, query);
                    aiState.done([
                        ...aiState.get(),
                        {
                            id: Date.now(),
                            role: "assistant",
                            content: summary
                        }
                    ]);
                    return <BotMessage
                        query={query}
                        images={processedResponse.images}
                        topStories={processedResponse.topStories}
                        summary={summary}
                        relatedSearch={processedResponse.relatedSearches}
                    ></BotMessage>;
                }
            }
        }
    });
    return {
        id: Date.now(),
        role: "assistant",
        display: reply.value
    };
};

export type AIState = Array<{
    id?: number,
    name?: "get_internet_serach"
    role: "user" | "assistant" | "system"
    content: string
}>;

export type UIState = Array<{
    id: number
    role: "user" | "assistant" | "tool_call"
    display: ReactNode
    toolInvocations?: ToolInvocation[];
}>;

export const AI = createAI({
    initialAIState: [] as AIState,
    initialUIState: [] as UIState,
    actions: {
        sendMessage
    }
});