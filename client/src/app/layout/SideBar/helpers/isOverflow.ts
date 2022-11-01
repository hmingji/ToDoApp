export function isOverflow(element: HTMLDivElement): boolean {
    return (
        element.clientHeight < element.scrollHeight || 
        element.clientWidth < element.scrollWidth
    );
}