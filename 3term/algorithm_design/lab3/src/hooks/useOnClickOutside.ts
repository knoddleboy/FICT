import { RefObject } from "preact";
import { useEffect } from "preact/hooks";

type Handler = (event: MouseEvent) => void;

function useOnClickOutside<T extends HTMLElement>(
    ref: RefObject<T>,
    handler: Handler,
    exceptRef: RefObject<HTMLElement>[] | null = null,
    mouseEvent: "mousedown" | "mouseup" = "mousedown"
): void {
    useEffect(() => {
        function listener(event: MouseEvent) {
            const el = ref?.current;
            const exceptEl = exceptRef?.map((r) => r?.current);

            // Do nothing if clicking ref's element or descendent elements
            if (!el || el.contains(event.target as Node)) {
                return;
            }

            // Also do nothing if clicking excepted elements
            if (exceptEl && exceptEl.length) {
                for (const el of exceptEl) {
                    if (!el || el.contains(event.target as Node)) {
                        return;
                    }
                }
            }

            handler(event);
        }

        document.addEventListener(mouseEvent, listener, true);

        return () => {
            document.removeEventListener(mouseEvent, listener, true);
        };
    }, [ref, handler]);
}

export default useOnClickOutside;
