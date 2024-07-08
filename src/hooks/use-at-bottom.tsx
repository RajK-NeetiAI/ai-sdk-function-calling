import { useEffect, useState } from "react";

export function useAtBottom(offset = 0) {
    const [isAtBottom, setIsAtBottom] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsAtBottom(
                window.innerHeight + window.screenY > document.body.offsetHeight - offset
            );
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [offset]);
    return isAtBottom;
};