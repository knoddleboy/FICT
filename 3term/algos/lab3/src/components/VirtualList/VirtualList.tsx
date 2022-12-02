import { FunctionComponent as FC, RefObject } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";

interface IVirtualList {
    rootRef: RefObject<HTMLDivElement>;
    className?: string;
    numItems: number;
    itemHeight: number;
    renderItem: ({
        index,
        style,
    }: {
        index: number;
        style: JSXInternal.CSSProperties;
    }) => JSXInternal.Element;
}

export const VirtualList: FC<IVirtualList> = ({
    rootRef,
    className,
    numItems,
    itemHeight,
    renderItem,
}) => {
    const [rootHeight, setRootHeight] = useState(0);

    useEffect(() => {
        setRootHeight(rootRef.current?.offsetHeight || 0);
    }, []);

    // Prevent too many rendering using useCallback
    const handleSize = useCallback(() => {
        setRootHeight(rootRef.current?.offsetHeight || 0);
    }, [rootRef.current?.offsetHeight]);

    useEffect(() => {
        if (!window) return;

        window.addEventListener("resize", handleSize);

        return () => window.removeEventListener("resize", handleSize);
    });

    const [scrollTop, setScrollTop] = useState(0);

    const innerHeight = numItems * itemHeight;
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
        numItems - 1, // don't render past the end of the list
        Math.floor((scrollTop + rootHeight) / itemHeight)
    );

    const items = [];
    for (let i = startIndex; i <= endIndex; i++) {
        items.push(
            renderItem({
                index: i,
                style: {
                    position: "absolute",
                    top: `${i * itemHeight}px`,
                    width: "100%",
                },
            })
        );
    }

    const onScroll = (e: UIEvent) => {
        setScrollTop((e.currentTarget as HTMLDivElement)?.scrollTop);
    };

    return (
        <div
            ref={rootRef}
            className={className}
            style={{ overflowY: "scroll" }}
            onScroll={onScroll}
        >
            <ul style={{ position: "relative", height: `${innerHeight}px` }}>{items}</ul>
        </div>
    );
};
