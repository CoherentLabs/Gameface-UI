// may move to base component
const resolveAnchor = (anchor: string | HTMLElement | undefined) => {
    const hasAnchor = anchor;
    if (!hasAnchor) return null;

    if (typeof anchor === 'string') {
        return document.querySelector(anchor);
    }

    if (anchor instanceof Element) {
        return anchor;
    }

    return null
}

export default resolveAnchor;