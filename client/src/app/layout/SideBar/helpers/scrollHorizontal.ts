export function scrollHorizontal(container: HTMLDivElement, scrollDistance: number) {
    container.scrollTo({
        left: container.scrollLeft + scrollDistance,
        behavior: "smooth"
    });
}