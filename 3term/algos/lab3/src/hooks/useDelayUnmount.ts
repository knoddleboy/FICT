import { useState, useEffect } from "preact/hooks";

function useDelayUnmount(isMounted: boolean, delay: number) {
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        let timeoutId: number;

        if (isMounted && !shouldRender) {
            setShouldRender(true);
        } else if (!isMounted && shouldRender) {
            timeoutId = setTimeout(() => setShouldRender(false), delay);
        }

        return () => clearTimeout(timeoutId);
    }, [isMounted, delay, shouldRender]);

    return shouldRender;
}

export default useDelayUnmount;
