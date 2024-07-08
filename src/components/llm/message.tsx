import { cn } from "@/lib/utils";
import { SparkleIcon, UserIcon } from "lucide-react";
import { ReactNode } from "react";

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
    children, className
}: {
    children: ReactNode, className?: string
}) {
    return (
        <div className={cn(
            "group relative flex items-start md:ml-12",
            className
        )}>
            <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm bg-background">
                <SparkleIcon></SparkleIcon>
            </div>
            <div className="ml-4 flex-1 space-y-2 px-1">
                {children}
            </div>
        </div>
    );
};

export function BotCard({
    children, showAvtar = true
}: {
    children: ReactNode, showAvtar?: boolean
}) {
    return (
        <div className={cn(
            "group relative flex items-start md:ml-12"
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
