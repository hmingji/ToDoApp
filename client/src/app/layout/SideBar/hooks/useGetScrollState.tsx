import { useEffect, useState } from "react";

export default function useGetScrollState(container: HTMLDivElement | null) {
    const [scrollX, setScrollX] = useState(0);
    const [isScrollEnd, setIsScrollEnd] = useState(false);

    const updateStateOnScroll = (e: Event) => {
        const targetElement = e.target as HTMLDivElement;

        if (Math.floor(targetElement.scrollWidth - targetElement.scrollLeft) <=
        targetElement.offsetWidth) {
            setIsScrollEnd(true);
        } else {
            setIsScrollEnd(false);
        }
        setScrollX(targetElement.scrollLeft);
    }

    useEffect(() => {
        if (container) container!.addEventListener('scroll', updateStateOnScroll);
        return () => {
            if (container) container.removeEventListener('scroll', updateStateOnScroll);
        }
    })

    return {
        scrollX,
        isScrollEnd
    };
}