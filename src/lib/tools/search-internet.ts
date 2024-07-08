import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

import { env } from "@/env.mjs";

export type SearchParameters = {
    q: string;
    type: string;
    engine: string;
};

export type KnowledgeGraph = {
    title: string;
    type: string;
    website: string;
    imageUrl: string;
    description: string;
    descriptionSource: string;
    descriptionLink: string;
    attributes: Record<string, string>;
};

export type OrganicResult = {
    title: string;
    link: string;
    snippet: string;
    position: number;
    sitelinks?: { title: string; link: string }[];
};

export type TopStory = {
    title: string;
    link: string;
    source: string;
    date: string;
    imageUrl: string;
};

export type PeopleAlsoAskItem = {
    question: string;
    snippet: string;
    title: string;
    link: string;
};

export type RelatedSearch = {
    query: string;
};

export type Images = {
    title: string;
    imageUrl: string;
    link: string;
};

export type GoogleSerperResponse = {
    searchParameters: SearchParameters;
    knowledgeGraph?: KnowledgeGraph;
    organic: OrganicResult[];
    topStories?: TopStory[];
    peopleAlsoAsk?: PeopleAlsoAskItem[];
    relatedSearches?: RelatedSearch[];
    images?: Images[];
};

export type ProcessedSerperData = {
    topStories: {
        title: string;
        link: string;
        source: string;
        date: string;
        imageUrl: string;
    }[];
    peopleAlsoAsked: {
        question: string;
        snippet: string;
        title: string;
        link: string;
    }[];
    relatedSearches: {
        query: string;
    }[];
    images: {
        title: string;
        imageUrl: string;
        link: string;
    }[];
};

export async function searchGoogleSerper(query: string): Promise<GoogleSerperResponse> {
    const url = 'https://google.serper.dev/search';
    const headers = new Headers({
        'X-API-KEY': env.SERPER_API_KEY,
        'Content-Type': 'application/json'
    });
    const body = JSON.stringify({ q: query, location: "Gujarat, India", gl: "in" });
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body,
        redirect: 'follow'
    };
    try {
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: GoogleSerperResponse = await response.json();
        return result;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export async function processSerperResponse(response: GoogleSerperResponse): Promise<ProcessedSerperData> {
    const topStories = response.topStories?.map(story => ({
        title: story.title,
        link: story.link,
        source: story.source,
        date: story.date,
        imageUrl: story.imageUrl
    })) || [];
    const peopleAlsoAsked = response.peopleAlsoAsk?.map(item => ({
        question: item.question,
        snippet: item.snippet,
        title: item.title,
        link: item.link
    })) || [];
    const relatedSearches = response.relatedSearches?.map(item => ({
        query: item.query
    })) || [];
    const images = response.images?.map(item => ({
        title: item.title,
        imageUrl: item.imageUrl,
        link: item.link
    })) || [];
    return {
        topStories,
        peopleAlsoAsked,
        relatedSearches,
        images
    };
};

const openai = createOpenAI({
    apiKey: env.OPENAI_API_KEY
});

export async function generateSummary(response: GoogleSerperResponse, query: string): Promise<string> {
    const knowledgeGraphDesc = response.knowledgeGraph?.description || '';
    const organicSnippets = response.organic.map(item => ({
        snippet: item.snippet,
        link: item.link
    }));
    const prompt = `
    Summarize the following information about ${response.searchParameters.q}:

    Knowledge Graph Description:
    ${knowledgeGraphDesc}

    Organic Search Results:
    ${organicSnippets.map(item => `- ${item.snippet} (Source: ${item.link})`).join('\n')}

    Please synthesize this information into a coherent, well-structured summary that:
    1. Provides a comprehensive overview of the main topic.
    2. Highlights the most important facts and details.
    3. Presents information in a logical flow.
    4. Is approximately 150-200 words long.
    5. Uses clear and concise language.
    6. Avoids repetition of information.
    7. Does not introduce any information not present in the given snippets.
    8. Always use markdown to format the summary.

    Your summary should be informative and engaging, suitable for someone seeking to quickly understand the key points about ${query}.
    Please provide the summary in markdown format, using appropriate headings and bullet points if necessary.`;
    try {
        const result = await generateText({
            model: openai(env.OPENAI_MODEL),
            messages: [{ role: "user", content: prompt }],
            maxTokens: 1024
        });
        return result.text;
    } catch (error) {
        console.error('Error generating summary:', error);
        return "Unable to generate summary.";
    }
};
