"use client";

import { useAtBottom } from "@/hooks/use-at-bottom";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function ChatScrollAnchor() {
    const trackVisibility = true;
    const isAtBottom = useAtBottom();
    const { ref, entry, inView } = useInView({
        trackVisibility: false,
        delay: 100,
        rootMargin: "0px 0px -50px 0px"
    });
    useEffect(() => {
        if (isAtBottom && trackVisibility && !inView) {
            entry?.target.scrollIntoView({
                block: "start"
            })
        }
    }, [isAtBottom, entry, inView]);
    return (
        <div ref={ref} className="h-px w-full"></div>
    );
}
