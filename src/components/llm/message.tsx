import { Images, RelatedSearch, TopStory } from "@/lib/tools/search-internet";
import { cn } from "@/lib/utils";
import { SparkleIcon, UserIcon } from "lucide-react";
import { ReactNode } from "react";
import { ImageCarousel } from "@/components/llm/image-carousel";
import Markdown from "react-markdown"
import { TopStoryCarousel } from "@/components/llm/top-story-card";
import { RelatedQueryButton } from "./realted-query";

export function UserMessage({ children }: { children: ReactNode }) {
    return (
        <div className="group relative flex items-start md:ml-12">
            <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm bg-background">
                <UserIcon color="black"></UserIcon>
            </div>
            <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
                {children}
            </div>
        </div>
    );
};

export function BotMessage({
    query,
    className,
    summary,
    images,
    relatedSearch,
    topStories
}: {
    query?: string
    className?: string,
    summary?: string,
    images?: Images[],
    relatedSearch?: RelatedSearch[]
    topStories?: TopStory[]
}) {
    return (
        <div className={cn(
            "group relative flex items-start md:ml-12",
            className
        )}>
            <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm bg-background">
                <SparkleIcon></SparkleIcon>
            </div>
            <div className="flex flex-col items-center justify-center">
                {
                    images && <ImageCarousel images={images}></ImageCarousel>
                }
                {
                    topStories && <TopStoryCarousel topStories={topStories}></TopStoryCarousel>
                }
                {
                    summary && <div className="ml-4 flex-1 space-y-2 px-1 mt-12">
                        <Markdown>{summary}</Markdown>
                    </div>
                }
                {
                    relatedSearch && <RelatedQueryButton relatedSearch={relatedSearch}></RelatedQueryButton>
                }
            </div>
        </div>
    );
};

export function BotCard({
    children, showAvtar = true, className
}: {
    children: ReactNode, showAvtar?: boolean, className?: string
}) {
    return (
        <div className={cn(
            "group relative flex items-start md:ml-12",
            className
        )}>
            <div className={cn(
                "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm bg-background",
                !showAvtar && "invisible"
            )}>
                <SparkleIcon></SparkleIcon>
            </div>
            <div className="ml-4 flex-1 px-1">
                {children}
            </div>
        </div>
    );
};

export function AssistantMessage({ children }: { children: ReactNode }) {
    return (
        <div className="mt-2 flex items-center justify-center gap-2 text-xs text-grey-500">
            <div className="max-w-[600px] flex-initial p-2">
                {children}
            </div>
        </div>
    );
};
